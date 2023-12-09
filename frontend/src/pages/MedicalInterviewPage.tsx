import { Box, Button, Heading } from '@chakra-ui/react';
import { useAccount, useContractWrite, usePrepareContractWrite, useWaitForTransaction, useContractEvent, useContractRead } from 'wagmi';
import { usePatientContext } from '../hooks/usePatientContext.tsx';
import * as ConsumerContract from '../../abi/DoctorOracle.sol/DoctorOracle.json';
import { requestConfig } from '../../functions.ts';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { decodeHexString } from '../cryptography.ts';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
const ENCRYPTED_SECRETS_REFERENCE = import.meta.env.VITE_ENCRYPTED_SECRETS_REFERENCE;
const SUBSCRIPTION_ID = parseInt(import.meta.env.VITE_SUBSCRIPTION_ID, 10);
const CALLBACK_GAS_LIMIT = 200_000;

interface LogWithResponse {
  args: {
    err: string;
    patientsAddress: string;
    requestId: string;
    response: string;
  };
}

export const MedicalInterviewPage = () => {
  const { publicKey, privateKey, signature } = usePatientContext();
  const { address, isConnected } = useAccount();
  const [events, setEvents] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isConnected) {
      navigate('/introduction');
    }
  }, [isConnected]);

  const {
    config,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: ConsumerContract.abi,
    functionName: 'sendRequest',
    args: [requestConfig.source, requestConfig.secretsLocation, ENCRYPTED_SECRETS_REFERENCE, requestConfig.args, [], SUBSCRIPTION_ID, CALLBACK_GAS_LIMIT],
    enabled: Boolean(true),
  });
  const { data, error, isError, write } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  useContractEvent({
    address: CONTRACT_ADDRESS,
    abi: ConsumerContract.abi,
    eventName: 'DoctorOracleResponse',
    listener(logs) {
      if (!logs?.length) {
        return;
      }

      logs.forEach((log) => {
        const { args } = log as unknown as LogWithResponse;
        if (args?.patientsAddress !== address) {
          // @todo uncomment
          // return;
        }

        const event = {
          requestId: args.requestId,
          err: decodeHexString(args.err),
          response: decodeHexString(args.response),
        };

        setEvents([...events, event]);
      });
    },
  });

  const {
    data: readData,
    isError: readError,
    isLoading: readLoading,
  } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: ConsumerContract.abi,
    functionName: 'owner',
  });

  const handleClick = async () => {
    await write?.();
  };

  return (
    <Box>
      <Heading>Medical Interview</Heading>
      <Button onClick={handleClick}>FIRE</Button>
      <pre>
        {JSON.stringify(
          {
            events,
            prepareError,
            isPrepareError,
            data,
            error,
            isError,
            isLoading,
            isSuccess,
            readData,
            readError,
            readLoading,
          },
          null,
          2
        )}
      </pre>
      <hr />
      <pre>
        {JSON.stringify(
          {
            address,
            isConnected,
            signature,
          },
          null,
          2
        )}
      </pre>
    </Box>
  );
};
