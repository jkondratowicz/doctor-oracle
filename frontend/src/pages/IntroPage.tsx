import logo from '../assets/logo.png';
import { Box, Heading } from '@chakra-ui/react';

export const IntroPage = () => {
  return (
    <Box>
      <img src={logo} alt="Doctor Oracle" />
      <Heading>Intro page</Heading>
      <p>You agree to:</p>
      <ol>
        <li>Never provide any personal information like name, address, phone number, etc.</li>
        <li>Use this service at your own risk, information provided is not a substitute for professional medical advice</li>
        <li>Accept risk of hallucinations</li>
        <li>Not to attempt to perform "prompt injection" or interfere with the underlying AI model</li>
      </ol>
    </Box>
  );
};
