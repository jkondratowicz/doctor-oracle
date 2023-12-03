import { ReactElement } from 'react';
import { Flex, Stack, Text, Link } from '@chakra-ui/react';
import { Link as ReactRouterLink } from 'react-router-dom';

interface FeatureProps {
  title: string;
  text: ReactElement | string;
  icon: ReactElement;
}

export const Feature = ({ title, text, icon }: FeatureProps) => {
  return (
    <Stack>
      <Flex w={16} h={16} align={'center'} justify={'center'} color={'white'} rounded={'full'} bg={'gray.100'} mb={1}>
        {icon}
      </Flex>
      <Text fontWeight={600}>{title}</Text>
      <Text color={'gray.600'}>{text}</Text>
      <Text>
        <Link as={ReactRouterLink} to="/faq" color="teal.500">
          Read more
        </Link>
      </Text>
    </Stack>
  );
};
