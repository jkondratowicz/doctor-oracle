import { Box, Center, Image, VStack } from '@chakra-ui/react';
import logo from '../assets/logo.png';
import { Outlet } from 'react-router-dom';
import { Footer } from './Footer.tsx';

export const Layout = () => {
  return (
    <VStack spacing={0}>
      <Box w="100%" h="80px" bg="brand.lightBlue" p={2}>
        <Center>
          <Image src={logo} alt="Doctor Oracle" h="64px" />
        </Center>
      </Box>
      <Box w="100%" bg="brand.bgGrey" py={6}>
        <Center>
          <Box p={4} mb={8} maxW="1200px">
            <Outlet />
          </Box>
        </Center>
      </Box>
      <Box w="100%" bg="white" pt={20}>
        <Center>
          <Box p={4} mb={8} maxW="1200px">
            <Footer />
          </Box>
        </Center>
      </Box>
    </VStack>
  );
};
