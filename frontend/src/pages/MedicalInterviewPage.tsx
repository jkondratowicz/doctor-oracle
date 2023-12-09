import { Alert, AlertIcon, Button, Heading } from '@chakra-ui/react';
import { useAccount, useContractWrite, usePrepareContractWrite, useWaitForTransaction, useContractEvent, useContractRead } from 'wagmi';
import { usePatientContext } from '../hooks/usePatientContext.tsx';
import * as ConsumerContract from '../../abi/DoctorOracle.sol/DoctorOracle.json';
import { requestConfig } from '../functions.ts';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { decodeHexString, decrypt, encrypt } from '../cryptography.ts';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
const ENCRYPTED_SECRETS_REFERENCE = import.meta.env.VITE_ENCRYPTED_SECRETS_REFERENCE;
const IPFS_GATEWAY = import.meta.env.VITE_IPFS_GATEWAY;
const ENCRYPTION_KEY = import.meta.env.VITE_FUNCTIONS_PUBLIC_KEY;
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

interface EncryptedResponse {
  encryptedAesKey: string;
  encryptedData: string;
  iv: string;
}

// @todo cleanup
const sampleConversation = [
  {
    role: 'system',
    content:
      "You are an Large Language Model assistant specializing in providing accurate medical advice to members of underserved communities, who don't have access to qualified healthcare professionals. You provide advice and help users diagnose any medical issues they might have based on the symptoms they describe. You are always sure to only provide advice based on current consensus of the medical establishment. Before prosposing any treatment, always make sure to recommend user seeks professional medical care. In case the symptoms described by the user point to a serious health issue that could potentially be life threatening, categorically ask the user to immediately seek professional help. If problems or symptoms described are not conclusively pointing to a single cause, list all potential reasons with appropriate explanations how they could be tied to a particular diagnosis. If not enough information is provided to offer an initial diagnosis, ask follow-up questions. Always make sure to include potential treatment options for diagnosed conditions and health issues.",
  },
  {
    role: 'assistant',
    content:
      "Hello, my name is Doctor Oracle. I'm an AI assistant and I'm here to help you diagnose any potential health issues. Please note that information I provide should not be treated as medical advice and is only for informational purposes. If you are experiencing serious medical symptoms, please seek help from qualified medical professionals.",
  },
  { role: 'user', content: 'Hi, my head hurts because a wild coyote dropped an anvil on it...' },
];
const sampleResponse = {
  encryptedData: 'osBPDhvqXD2wB3nnvUtOXNI7h/ReWoaReQh/4axpnHKnghXAM3joUl3ljCKHcifdCG4FkRHGfQGQxvreNrw9flAV/R5q',
  iv: 'Hpecb8cLXjgRWMAx',
  encryptedAesKey:
    'kNDHwbiMCcOmxE+c5sLX+Ene+4qVwRITnvogpgRzKlTx/k8+9jl64sk0jvK82tXCgXgc5nGKdr1yM5D0+l8ffL4NQVamFPPIFI5SpuY9CUq6yUDcQTzKpsbjqKRgYwOkwjrRApKx5OI+6UDxo3ea/U7ETq/t3Z0WrOKCdxyp/v3TsVGwYObirGT80h/pbLmVhGWUcKhdYE1nUIUaS1CCvVbra3vM0Ixk1rPFeA0AU4iQfypPbcHJFYiVC7oBKisGaXekZKkQI3LXKrJaNFw89eHxq9GcQFngbdjQrTuCvBG1i3ipBwSyl5ycSrc8y81Npu2o7gvd/OLOxc/bLn/o2w==',
};

export const MedicalInterviewPage = () => {
  const navigate = useNavigate();
  const { publicKey, privateKey, signature } = usePatientContext();
  const { address, isConnected } = useAccount();
  const [events, setEvents] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [ipfsUrl, setIpfsUrl] = useState('');

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
    args: [requestConfig.source, requestConfig.secretsLocation, ENCRYPTED_SECRETS_REFERENCE, [ipfsUrl, publicKey], [], SUBSCRIPTION_ID, CALLBACK_GAS_LIMIT],
    enabled: Boolean(true),
  });
  const { data: writeData, error: writeError, isError: isWriteError, write } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: writeData?.hash,
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
          error: decodeHexString(args.err),
          cid: decodeHexString(args.response),
        };

        void processResponseEvent(event);
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

  const processResponseEvent = async (event: { requestId: string; error: string; cid: string }) => {
    setEvents([...events, event]);

    if (event.error) {
      setError(event.error);
    } else {
      const ipfsUrl = `https://asleep-accident-cause.quicknode-ipfs.com/ipfs/${event.cid}`;
      const response = await fetch(ipfsUrl);
      const json: EncryptedResponse = await response.json();
      const { encryptedData, encryptedAesKey, iv } = json;

      const decrypted = await decrypt(encryptedData, iv, encryptedAesKey, privateKey);
      console.log('decrypted', decrypted);
    }
  };

  const handleSampleResponse = async () => {
    try {
      const decrypted = await decrypt(sampleResponse.encryptedData, sampleResponse.iv, sampleResponse.encryptedAesKey, privateKey);
      console.log('decrypted', decrypted);
    } catch (e) {
      console.log(e);
    }
  };

  const encryptSaveAndSend = async () => {
    const encrypted = await encrypt(sampleConversation, ENCRYPTION_KEY);
    const options = {
      method: 'POST',
      body: JSON.stringify({
        content: JSON.stringify(encrypted),
        filename: 'encrypted.txt',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const ipfsResponse = await fetch(IPFS_GATEWAY, options);
    const ipfsJson = await ipfsResponse.json();
    const cid = ipfsJson.cid;
    const url = `https://asleep-accident-cause.quicknode-ipfs.com/ipfs/${cid}`;
    setIpfsUrl(url);

    console.log(url);
  };

  const handleClick = async () => {
    setError('');
    await write?.();
  };

  return (
    <>
      {error && (
        <Alert status="warning" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}
      <Heading as="h2">Medical survey</Heading>
      <Button onClick={handleClick} mx={2}>
        FIRE
      </Button>
      <Button onClick={handleSampleResponse} mx={2}>
        Process sample response
      </Button>
      <Button onClick={encryptSaveAndSend} mx={2}>
        Encrypt, ping and send
      </Button>
      <pre>
        {JSON.stringify(
          {
            ipfsUrl,
            events,
            prepareError,
            isPrepareError,
            writeData,
            error,
            writeError,
            isWriteError,
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
    </>
  );
};
