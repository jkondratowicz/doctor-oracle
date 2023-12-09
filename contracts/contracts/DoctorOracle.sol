// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/FunctionsClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest.sol";

// @todo natspec
contract DoctorOracle is FunctionsClient, ConfirmedOwner {
    using FunctionsRequest for FunctionsRequest.Request;

    bytes32 public s_donId;
    bytes32 public s_lastRequestId;
    mapping(address => uint) public s_balances;
    mapping(bytes32 => address) public s_patientAddresses;
    mapping(bytes32 => bytes) public s_responses;
    mapping(bytes32 => bytes) public s_errors;

    error InsufficientBalance(address patient);

    event DoctorOracleResponse(bytes32 indexed requestId, address indexed patientsAddress, bytes response, bytes err);

    constructor(
        address router,
        bytes32 donId
    ) FunctionsClient(router) ConfirmedOwner(msg.sender) {
        s_donId = donId;
    }

    function setDonId(bytes32 newDonId) external onlyOwner {
        s_donId = newDonId;
    }

    function sendRequest(
        string calldata source,
        FunctionsRequest.Location secretsLocation,
        bytes calldata encryptedSecretsReference,
        string[] calldata args,
        bytes[] calldata bytesArgs,
        uint64 subscriptionId,
        uint32 callbackGasLimit
    ) external returns (bytes32 requestId) {
        _validateAndSubtractBalance(msg.sender, callbackGasLimit);


        FunctionsRequest.Request memory req;
        req.initializeRequest(FunctionsRequest.Location.Inline, FunctionsRequest.CodeLanguage.JavaScript, source);
        req.secretsLocation = secretsLocation;
        req.encryptedSecretsReference = encryptedSecretsReference;
        if (args.length > 0) {
            req.setArgs(args);
        }
        if (bytesArgs.length > 0) {
            req.setBytesArgs(bytesArgs);
        }
        s_lastRequestId = _sendRequest(req.encodeCBOR(), subscriptionId, callbackGasLimit, s_donId);

        s_patientAddresses[s_lastRequestId] = msg.sender;

        return s_lastRequestId;
    }

    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        s_responses[requestId] = response;
        s_errors[requestId] = err;
        emit DoctorOracleResponse(requestId, s_patientAddresses[requestId], response, err);

        // @todo in post-PoC version, calculate actual gas used and refund the difference
    }

    function updateBalance(
        address patient,
        uint newBalance
    ) external onlyOwner {
        s_balances[patient] = newBalance;
    }

    function _validateAndSubtractBalance(address patient, uint32 gasLimit) internal {
        if (msg.sender == owner()) {
            return;
        }
        uint requiredBalance = _getJuelsFromWei(gasLimit * tx.gasprice);
        if (s_balances[patient] < requiredBalance) {
            revert InsufficientBalance(patient);
        }
        s_balances[patient] -= requiredBalance;
    }

    // @notice mocked for PoC, normally we'd get it from Chainlink price feeds, but for testnet it makes little sense
    function _getJuelsFromWei(uint256 amountWei) private pure returns (uint96) {
        return uint96(1e9 * amountWei);
    }
}
