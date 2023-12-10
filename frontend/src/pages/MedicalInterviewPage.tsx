import {
  Alert,
  AlertIcon,
  Box,
  Heading,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  Stepper,
  StepSeparator,
  StepStatus,
  StepTitle,
  useSteps,
} from '@chakra-ui/react';
import { useAccount, useContractWrite, usePrepareContractWrite, useContractEvent } from 'wagmi';
import { usePatientContext } from '../hooks/usePatientContext.tsx';
import * as ConsumerContract from '../../abi/DoctorOracle.sol/DoctorOracle.json';
import { requestConfig } from '../utils/functions.ts';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { decodeHexString, decrypt, encrypt } from '../utils/cryptography.ts';
import { InterviewStage1 } from '../components/InterviewStage1.tsx';
import { convertMedicalSurveyToQA, EncryptedResponse, MedicalSurvey, qaToPrompt, steps } from '../utils/survey.ts';
import { InterviewStage2 } from '../components/InterviewStage2.tsx';
import { InterviewStage3 } from '../components/InterviewStage3.tsx';
import { InterviewStage4 } from '../components/InterviewStage4.tsx';
import { InterviewStage5 } from '../components/InterviewStage5.tsx';

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

export const MedicalInterviewPage = () => {
  const navigate = useNavigate();
  const { publicKey, privateKey } = usePatientContext();
  const { address, isConnected } = useAccount();
  const [events, setEvents] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [ipfsUrl, setIpfsUrl] = useState('');
  const [surveyData, setSurveyData] = useState<MedicalSurvey>({});
  const { activeStep, goToNext } = useSteps({
    index: 1,
    count: steps.length,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [alreadySent, setAlreadySent] = useState(false);
  const [decryptedResponse, setDecryptedResponse] = useState();
  const [loadingStage, setLoadingStage] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeStep]);

  useEffect(() => {
    if (!isConnected) {
      navigate('/introduction');
    }
  }, [isConnected]);

  const { config, error: prepareError } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: ConsumerContract.abi,
    functionName: 'sendRequest',
    args: [requestConfig.source, requestConfig.secretsLocation, ENCRYPTED_SECRETS_REFERENCE, [ipfsUrl, publicKey], [], SUBSCRIPTION_ID, CALLBACK_GAS_LIMIT],
    enabled: Boolean(ipfsUrl),
  });
  const { error: writeError, write, isSuccess } = useContractWrite(config);

  useEffect(() => {
    if (!ipfsUrl) {
      return;
    }
    setLoadingStage(2);
  }, [ipfsUrl]);

  useEffect(() => {
    if (isSuccess) {
      setLoadingStage(3);
      setAlreadySent(true);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (write && typeof write === 'function' && Boolean(ipfsUrl) && !alreadySent) {
      write();
    }
  }, [write]);

  useEffect(() => {
    if (!decryptedResponse) {
      return;
    }

    setIsLoading(false);
  }, [decryptedResponse]);

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
      setDecryptedResponse(decrypted);
    }
  };

  const encryptSaveAndSend = async (data: any) => {
    const encrypted = await encrypt(data, ENCRYPTION_KEY);
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
    return url;
  };

  const setValue = (key: string, value: any) => {
    setSurveyData({
      ...surveyData,
      [key]: value,
    });
  };

  const handleSubmit = async () => {
    goToNext();
    setError('');
    setIsLoading(true);
    setLoadingStage(1);
    const parsedData = convertMedicalSurveyToQA(surveyData);
    const prompt = qaToPrompt(parsedData);
    await encryptSaveAndSend(prompt);
  };

  return (
    <>
      {(prepareError || writeError || error) && (
        <Alert status="warning" mb={4}>
          <AlertIcon />
          {prepareError?.message || writeError?.message || error}
        </Alert>
      )}
      <Heading as="h2" mb={4}>
        Medical survey
      </Heading>
      <Stepper size="sm" colorScheme="teal" index={activeStep} mb={4}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepIndicator>
              <StepStatus complete={<StepIcon />} incomplete={<StepNumber />} active={<StepNumber />} />
            </StepIndicator>

            <Box flexShrink="0">
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </Box>

            <StepSeparator />
          </Step>
        ))}
      </Stepper>
      {activeStep === 1 && <InterviewStage1 setValue={setValue} data={surveyData} nextStep={goToNext} />}
      {activeStep === 2 && <InterviewStage2 setValue={setValue} data={surveyData} nextStep={goToNext} />}
      {activeStep === 3 && <InterviewStage3 setValue={setValue} data={surveyData} nextStep={goToNext} />}
      {activeStep === 4 && <InterviewStage4 data={surveyData} submit={handleSubmit} />}
      {activeStep === 5 && <InterviewStage5 data={surveyData} isLoading={isLoading} loadingStage={loadingStage} response={decryptedResponse} />}
    </>
  );
};
