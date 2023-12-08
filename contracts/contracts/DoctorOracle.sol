// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/FunctionsClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest.sol";

// @todo natspec
contract DoctorOracle is FunctionsClient, ConfirmedOwner {
    using FunctionsRequest for FunctionsRequest.Request;

    bytes32 public s_lastRequestId;
    mapping(address => uint) public s_balances;
    mapping(bytes32 => address) public s_patientAddresses;
    mapping(bytes32 => bytes) public s_responses;
    mapping(bytes32 => bytes) public s_errors;

    error InsufficientBalance(address patient);

    event DoctorOracleResponse(bytes32 indexed requestId, address indexed patientsAddress, bytes response, bytes err);

    constructor(
        address router
    ) FunctionsClient(router) ConfirmedOwner(msg.sender) {}

    function sendRequest(
        string memory source,
        bytes memory encryptedSecretsUrls,
        uint8 donHostedSecretsSlotID,
        uint64 donHostedSecretsVersion,
        string[] memory args,
        bytes[] memory bytesArgs,
        uint64 subscriptionId,
        uint32 gasLimit,
        bytes32 donID
    ) external returns (bytes32 requestId) {
        _validateAndSubtractBalance(msg.sender, gasLimit);

        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(source);

        if (encryptedSecretsUrls.length > 0) {
            req.addSecretsReference(encryptedSecretsUrls);
        } else if (donHostedSecretsVersion > 0) {
            req.addDONHostedSecrets(
                donHostedSecretsSlotID,
                donHostedSecretsVersion
            );
        }
        if (args.length > 0) req.setArgs(args);
        if (bytesArgs.length > 0) req.setBytesArgs(bytesArgs);
        s_lastRequestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            gasLimit,
            donID
        );
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

        // @todo in real product we'd calculate actual gas used and refund the difference
    }

    function _validateBalance(address patient, uint32 gasLimit) internal {
        uint requiredBalance = _getJuelsFromWei(gasLimit * tx.gasprice);
        if (s_balances[patient] < requiredBalance) {
            revert InsufficientBalance(patient);
        }
        s_balances[patient] -= requiredBalance;
    }

    // @notice normally we'd get it from Chainlink price feeds, but for testnet it makes little sense :)
    function _getJuelsFromWei(uint256 amountWei) private view returns (uint96) {
        return 1e9;
    }
}
