import logo from '../assets/logo.png';
import nurseIcon from '../assets/icons8-nurse-48.png';
import { Box, Button, Center, Icon, SimpleGrid, VStack } from '@chakra-ui/react';
import { Feature } from '../components/Feature.tsx';
import { FcGlobe, FcKey, FcSurvey } from 'react-icons/fc';
import { Link as ReactRouterLink } from 'react-router-dom';
import { Footer } from '../components/Footer.tsx';

export const HomePage = () => {
  return (
    <VStack spacing={0}>
      <Box w="100%" bg="brand.lightBlue" py={12}>
        <Center>
          <VStack>
            <img src={logo} alt="Doctor Oracle" />
            <Button
              size="lg"
              leftIcon={<img src={nurseIcon} alt="Doctor Oracle" />}
              mt={12}
              mb={6}
              py={8}
              border="2px"
              borderColor="brand.darkRed"
              as={ReactRouterLink}
              to="/introduction"
            >
              Get started - talk to Doctor Oracle
            </Button>
          </VStack>
        </Center>
      </Box>
      <Box w="100%" bg="brand.bgGrey" py={6}>
        <Center>
          <Box p={4} mb={8} maxW="1200px">
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
              <Feature
                icon={<Icon as={FcSurvey} w={10} h={10} />}
                title={'Short, but detailed medical survey'}
                text={
                  'Doctor Oracle will ask you a series of questions to determine the best course of action for your medical needs. If necessary, you will be asked a few follow-up questions'
                }
              />
              <Feature
                icon={<Icon as={FcKey} w={10} h={10} />}
                title={'Strong encryption'}
                text={
                  <>
                    Your data is safe with us. We use <strong>strong encryption</strong> (RSA + AES) combined with privacy-preserving blockchain technology (
                    <strong>Chainlink Functions</strong>) to ensure that the information you provide is safe and secure.
                  </>
                }
              />
              <Feature
                icon={<Icon as={FcGlobe} w={10} h={10} />}
                title={'Available worldwide'}
                text={
                  <>
                    Doctor Oracle can provide accurate medical information to people all around the globe, including{' '}
                    <strong>members of underserved communities</strong> with limited access to professional healthcare.
                  </>
                }
              />
            </SimpleGrid>
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
