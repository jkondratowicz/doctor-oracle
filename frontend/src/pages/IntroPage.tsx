import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { Button, List, ListIcon, ListItem, Alert, AlertIcon, Text, Heading } from '@chakra-ui/react';
import { MdCheckCircle } from 'react-icons/md';
import { usePatientContext } from '../hooks/usePatientContext.tsx';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheck } from 'react-icons/fa';

export const IntroPage = () => {
  const { setSecretString } = usePatientContext();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const handleClick = async () => {
    setError('');
    try {
      setIsLoading(true);
      if (isConnected) {
        await disconnectAsync();
      }

      const { chain } = await connectAsync({
        connector: new InjectedConnector(),
      });

      if (chain.id !== 80001) {
        throw new Error('Please connect to Polygon Mumbai testnet');
      }

      const message = `I hereby agree to Doctor Oracle's terms of service.`;

      const signature = await signMessageAsync({ message });

      if (!signature) {
        throw new Error('No signature received');
      }

      setSecretString(signature);
      navigate('/interview');
    } catch (e: any) {
      console.log('Error signing message', e);
      setError(e?.message ?? 'Please connect your wallet and sign the message to continue.');
      await disconnectAsync();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {error && (
        <Alert status="warning" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}
      <Heading as="h2">Welcome!</Heading>
      <Text as="p" fontSize="lg" py={3}>
        In a moment, you will be asked a series of questions about your medical condition. Please answer them to the best of your ability and provide as much
        details as you can.
      </Text>
      <Text as="p" fontSize="lg" py={3}>
        Before we proceed, you must agree with Doctor Oracle's terms of service listed below. Please read them carefully, and only click the button below if you
        agree with all of them.
      </Text>

      <Text as="p" py={3}>
        <strong>By clicking on the button below, you agree to the following terms of service:</strong>
      </Text>
      <List spacing={4}>
        <ListItem>
          <ListIcon as={MdCheckCircle} color="green.500" />
          You are not allowed to disclose any personal information like your name, address, phone number, or any other information that may be used to identify
          you.
        </ListItem>
        <ListItem>
          <ListIcon as={MdCheckCircle} color="green.500" />
          You use this service at your own risk and by agreeing to these terms, you acknowledge that you understand that any information provided by Doctor
          Oracle is not medical advice and may not be used as a substitute for professional healthcare.
        </ListItem>
        <ListItem>
          <ListIcon as={MdCheckCircle} color="green.500" />
          Under no circumstances should this service be used to diagnose or treat medical conditions in others; users are only allowed to enter medical
          information related to themselves. Children under the age of 18 are not allowed to use the service.
        </ListItem>
        <ListItem>
          <ListIcon as={MdCheckCircle} color="green.500" />
          Information presented by Doctor Oracle is generated using Large Language Models (LLMs) and may not be accurate, including the risk of hallucinations
          and bias.
        </ListItem>
        <ListItem>
          <ListIcon as={MdCheckCircle} color="green.500" />
          You are not allowed to perform "prompt injection", or attempt to interfere with the underlying AI model in any way.
        </ListItem>
        <ListItem>
          <ListIcon as={MdCheckCircle} color="green.500" />
          Information gathered during medical survey will be encrypted using asymmetric encryption, and stored on the blockchain and IPFS only in an encrypted
          format. However, Chainlink nodes will decrypt this information using threshold signatures, and transmit it to OpenAI's API.
        </ListItem>
      </List>
      <Button color="green" onClick={handleClick} size="lg" mt={6} leftIcon={<FaCheck />} isLoading={isLoading} loadingText="Connecting wallet and signing...">
        I agree to those terms
      </Button>
    </>
  );
};
