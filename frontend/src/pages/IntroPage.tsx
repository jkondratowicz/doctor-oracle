import logo from '../assets/logo.png';
import { Box, Heading } from '@chakra-ui/react';

export const IntroPage = () => {
  return (
    <Box>
      <img src={logo} alt="Doctor Oracle" />
      <Heading>Intro page</Heading>
    </Box>
  );
};
