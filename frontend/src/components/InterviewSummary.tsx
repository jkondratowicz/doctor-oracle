import { Box, Card, Stack, StackDivider, Text } from '@chakra-ui/react';
import { convertMedicalSurveyToQA, MedicalSurvey } from '../utils/survey.ts';
import { NiceMarkdown } from './NiceMarkdown.tsx';

export const InterviewSummary = ({ data }: { data: MedicalSurvey }) => {
  const parsedData = convertMedicalSurveyToQA(data);
  return (
    <Card bg="gray.100" p={4} rounded="md" my={4}>
      <Stack spacing={2} divider={<StackDivider borderColor="gray.200" />}>
        {parsedData?.map((row, idx) => (
          <Box key={idx}>
            <Text fontWeight="bold" color="gray.700">
              {row.question}
            </Text>
            <NiceMarkdown text={row.answer} />
          </Box>
        ))}
      </Stack>
    </Card>
  );
};
