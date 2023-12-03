import { ReactNode } from 'react';
import { Box, Container, Stack, Text, VisuallyHidden, chakra, useColorModeValue } from '@chakra-ui/react';
import { FaGithub } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const SocialButton = ({ children, label, href }: { children: ReactNode; label: string; href: string }) => {
  return (
    <chakra.button
      bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
      rounded={'full'}
      w={8}
      h={8}
      cursor={'pointer'}
      as={'a'}
      href={href}
      display={'inline-flex'}
      alignItems={'center'}
      justifyContent={'center'}
      transition={'background 0.3s ease'}
      _hover={{
        bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

export const Footer = () => {
  return (
    <Box color={useColorModeValue('gray.700', 'gray.200')}>
      <Container as={Stack} maxW={'6xl'} py={4} spacing={4} justify={'center'} align={'center'}>
        <Stack direction={'row'} spacing={20}>
          <Box as={Link} to={'/'}>
            Home page
          </Box>
          <Box as={Link} to={'/introduction'}>
            Medical survey
          </Box>
          <Box as={Link} to={'/faq'}>
            FAQ
          </Box>
          <SocialButton label={'GitHub'} href={'https://github.com/jkondratowicz/doctor-oracle'}>
            <FaGithub />
          </SocialButton>
        </Stack>
      </Container>

      <Box borderTopWidth={1} borderStyle={'solid'} borderColor={useColorModeValue('gray.200', 'gray.700')}>
        <Container
          as={Stack}
          maxW={'6xl'}
          py={4}
          direction={{ base: 'column', md: 'row' }}
          spacing={4}
          justify={{ base: 'center', md: 'space-between' }}
          align={{ base: 'center', md: 'center' }}
        >
          <Text color={'gray.400'}>Doctor Oracle is in a proof of concept stage. DO NOT USE FOR ACTUAL MEDICAL ADVICE!</Text>
        </Container>
      </Box>
    </Box>
  );
};
