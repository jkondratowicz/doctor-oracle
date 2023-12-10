import { MedicalSurvey } from '../utils/survey.ts';
import { Button, Heading, Stack, Text } from '@chakra-ui/react';
import { HiArrowLongRight } from 'react-icons/hi2';
import { InterviewSummary } from './InterviewSummary.tsx';

export const InterviewStage4 = ({ data, submit }: { data: MedicalSurvey; submit: () => Promise<void> }) => {
  return (
    <Stack spacing={3} mt={8}>
      <Heading as="h3" size="lg">
        Review your medical survey
      </Heading>
      <Text fontSize="lg">Please review the details below and submit your medical survey to Doctor Oracle.</Text>
      <InterviewSummary data={data} />
      <Button rightIcon={<HiArrowLongRight />} colorScheme="green" variant="solid" onClick={submit}>
        Submit your medical survey
      </Button>
    </Stack>
  );
};
