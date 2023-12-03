import { Box, Heading } from '@chakra-ui/react';

interface ErrorPageProps {
  code?: number;
}
export const ErrorPage = ({ code }: ErrorPageProps) => {
  return (
    <Box>
      <Heading>Error :(</Heading>
      {code && <p>{code}</p>}
    </Box>
  );
};
