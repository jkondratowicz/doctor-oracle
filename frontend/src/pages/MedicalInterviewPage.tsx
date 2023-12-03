import { Box, Heading } from '@chakra-ui/react';
import { useAccount, useEnsAvatar, useEnsName } from 'wagmi';
import { usePatientContext } from '../hooks/usePatientContext.tsx';

export const MedicalInterviewPage = () => {
  const { secretString } = usePatientContext();
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ name: ensName });

  return (
    <Box>
      <Heading>Medical Interview</Heading>
      <pre>
        {JSON.stringify(
          {
            address,
            isConnected,
            ensName,
            ensAvatar,
            secretString,
          },
          null,
          2
        )}
      </pre>
    </Box>
  );
};
