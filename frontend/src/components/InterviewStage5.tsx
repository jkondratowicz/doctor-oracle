import { MedicalSurvey } from '../utils/survey.ts';
import { Card, FormControl, FormLabel, Heading, Spinner, Stack, Switch, Text } from '@chakra-ui/react';
import { InterviewSummary } from './InterviewSummary.tsx';
import { useState } from 'react';
import { NiceMarkdown } from './NiceMarkdown.tsx';

export const InterviewStage5 = ({ data, isLoading, response }: { data: MedicalSurvey; isLoading: boolean; response?: string }) => {
  const [showSurvey, setShowSurvey] = useState(false);
  if (isLoading) {
    return (
      <Stack spacing={3} mt={8}>
        <Heading as="h3" size="lg">
          Your diagnosis and recommendations
        </Heading>
        <Card bg="gray.100" p={4} rounded="md" my={4}>
          <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" mb={4} />
          <Text fontSize="lg">Please wait while Doctor Oracle analyzes your medical survey...</Text>
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
