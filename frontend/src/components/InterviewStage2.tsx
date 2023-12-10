import { InterviewStageProps } from '../utils/survey.ts';
import { Button, Heading, Stack, Text } from '@chakra-ui/react';
import { SurveyQuestion } from './SurveyQuestion.tsx';
import { HiArrowLongRight } from 'react-icons/hi2';

export const InterviewStage2 = ({ data, setValue, nextStep }: InterviewStageProps) => {
  return (
    <Stack spacing={3} mt={8}>
      <Heading as="h3" size="lg">
        Your current health
      </Heading>
      <Text fontSize="lg">
        Now I'll ask you about your current health. Please answer as accurately as possible, as this will help deliver the most accurate diagnosis possible.
      </Text>
      <SurveyQuestion
        value={data?.healthAndFitness}
        setValue={(v: any) => setValue('healthAndFitness', v)}
        type="textarea"
        toggle={false}
        question={'In your own words, how would you describe your general health and fitness level?'}
      />
      <SurveyQuestion
        value={data?.diagnosedConditions}
        setValue={(v: any) => setValue('diagnosedConditions', v)}
        type="optionalTextarea"
        question={'Have you been diagnosed with any chronic conditions?'}
        followUpQuestion={'Please list all diagnosed conditions and for how long you have had them.'}
      />
      <SurveyQuestion
        value={data?.prescriptionMedications}
        setValue={(v: any) => setValue('prescriptionMedications', v)}
        type="optionalTextarea"
        question={'Are you currently taking and prescription medication?'}
        followUpQuestion={'Please list them, including dosage.'}
      />
      <SurveyQuestion
        value={data?.allergies}
        setValue={(v: any) => setValue('allergies', v)}
        type="optionalTextarea"
        question={'Are you allergic to any drugs, or have other allergies?'}
        followUpQuestion={'Please describe your allergies and how long ago have you been diagnosed with them.'}
      />
      <Text fontSize={'lg'} my={6}>
        We're almost there! Just a few more questions on the next page and we're done.
      </Text>
      <Button rightIcon={<HiArrowLongRight />} colorScheme="green" variant="solid" onClick={nextStep}>
        Go to the next stage
      </Button>
    </Stack>
  );
};
