import { MedicalSurvey } from '../utils/survey.ts';
import { Card, FormControl, FormLabel, Heading, Spinner, Stack, Switch, Text } from '@chakra-ui/react';
import { InterviewSummary } from './InterviewSummary.tsx';
import { useState } from 'react';
import { NiceMarkdown } from './NiceMarkdown.tsx';

export const InterviewStage5 = ({
  data,
  isLoading,
  response,
  loadingStage,
}: {
  data: MedicalSurvey;
  isLoading: boolean;
  response?: string;
  loadingStage: number;
}) => {
  const [showSurvey, setShowSurvey] = useState(false);
  if (isLoading) {
    let loadingText;
    switch (loadingStage) {
      case 1:
        loadingText = 'Your medical survey is being encrypted using strong cryptography, please wait...';
        break;
      case 2:
        loadingText = 'Your medical survey is being sent to Doctor Oracle, please confirm the transaction.';
        break;
      default:
        loadingText = 'Doctor Oracle is analyzing your medical survey. Please wait for the response. It should take around one minute.';
        break;
    }
    return (
      <Stack spacing={3} mt={8} minW="xl">
        <Heading as="h3" size="lg">
          Your diagnosis and recommendations
        </Heading>
        <Card bg="gray.100" p={6} rounded="md" my={4}>
          <Spinner thickness="4px" speed="0.65s" emptyColor="gray.100" color="red.500" size="xl" mb={4} mx="auto" />
          <Text fontSize="lg">{loadingText}</Text>
        </Card>
      </Stack>
    );
  }

  return (
    <Stack spacing={3} mt={8}>
      <Heading as="h3" size="lg">
        Your diagnosis and recommendations
      </Heading>
      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor="show-survey" mb="0">
          Show the medical survey
        </FormLabel>
        <Switch id="show-survey" onChange={(e) => setShowSurvey(!!e?.target?.checked)} />
      </FormControl>
      {showSurvey && <InterviewSummary data={data} />}
      <Card bg="gray.100" p={4} rounded="md" my={4}>
        <Heading size="md" mb={4}>
          Doctor Oracle says:
        </Heading>
        <NiceMarkdown text={response ?? ''} />
      </Card>
    </Stack>
  );
};
