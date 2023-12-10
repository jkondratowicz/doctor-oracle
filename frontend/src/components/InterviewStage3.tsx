import { InterviewStageProps } from '../utils/survey.ts';
import { Button, Heading, Stack, Text } from '@chakra-ui/react';
import { SurveyQuestion } from './SurveyQuestion.tsx';
import { HiArrowLongRight } from 'react-icons/hi2';

export const InterviewStage3 = ({ data, setValue, nextStep }: InterviewStageProps) => {
  return (
    <Stack spacing={3} mt={8}>
      <Heading as="h3" size="lg">
        How can I help?
      </Heading>
      <Text fontSize="lg">This is the final step of the medical survey. Please describe the reason you're seeking medical advice today.</Text>
      <SurveyQuestion
        value={data?.injuryRelated}
        setValue={(v: any) => setValue('injuryRelated', v)}
        type="optionalTextarea"
        question={'Is the reason for your consultation related to a recently sustained injury?'}
        followUpQuestion={'Please describe what happened in detail.'}
      />
      <SurveyQuestion
        value={data?.previousConsultation}
        setValue={(v: any) => setValue('previousConsultation', v)}
        type="optionalTextarea"
        question={'Have you already consulted a medical professional about your predicament before?'}
        followUpQuestion={'Please describe your previous consultation(s) and recommendations you received.'}
      />
      <SurveyQuestion
        value={data?.symptoms}
        setValue={(v: any) => setValue('symptoms', v)}
        type="textarea"
        xl={true}
        toggle={false}
        question={'Please describe in detail the symptoms you are experiencing.'}
        helpText={
          'If you are experiencing multiple symptoms, please describe them all. Feel free to include any additional information you think might be relevant.'
        }
      />
      <Text fontSize={'lg'} my={6}>
        That's it! On the next page you'll review your medical survey report and submit it to the doctor.
      </Text>
      <Button rightIcon={<HiArrowLongRight />} colorScheme="green" variant="solid" onClick={nextStep}>
        Go to the next stage
      </Button>
    </Stack>
  );
};
