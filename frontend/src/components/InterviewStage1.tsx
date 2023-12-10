import { InterviewStageProps } from '../utils/survey.ts';
import { Button, Heading, Stack, Text } from '@chakra-ui/react';
import { SurveyQuestion } from './SurveyQuestion.tsx';
import { HiArrowLongRight } from 'react-icons/hi2';

export const InterviewStage1 = ({ data, setValue, nextStep }: InterviewStageProps) => {
  return (
    <Stack spacing={3} mt={8}>
      <Heading as="h3" size="lg">
        Basic information about you
      </Heading>
      <Text fontSize="lg">
        Please answer a few basic questions about yourself. Feel free to skip them if you feel uncomfortable answering, but be aware that accurate information
        about you helps deliver the most accurate diagnosis possible.
      </Text>
      <SurveyQuestion
        value={data?.age}
        setValue={(v: any) => setValue('age', v)}
        type="number"
        toggle={true}
        question={'How old are you?'}
        helpText={"Feel free to enter a value that's not entirely accurate if you're not comfortable with providing your exact age."}
        min={18}
        max={120}
      />
      <SurveyQuestion
        value={data?.sex}
        setValue={(v: any) => setValue('sex', v)}
        type="choiceWithOther"
        toggle={true}
        question={'What is your sex?'}
        options={['Male', 'Female']}
      />
      <SurveyQuestion
        value={data?.lifestyle}
        setValue={(v: any) => setValue('lifestyle', v)}
        type="choiceWithOther"
        toggle={true}
        question={'Which best describes your general level of activity?'}
        options={[
          'Inactive: Never or rarely include physical activity in your day.',
          'Somewhat active: Include light activity or moderate activity about two to three times a week.',
          'Active: Include at least 30 minutes of moderate activity most days of the week, or 20 minutes of vigorous activity at least three days a week.',
          'Very active: Include large amounts of moderate or vigorous activity in your day.',
        ]}
      />

      <Text fontSize={'lg'} my={6}>
        You're doing great! If you're happy with the answers provided above, please proceed to the next stage.
      </Text>
      <Button rightIcon={<HiArrowLongRight />} colorScheme="green" variant="solid" onClick={nextStep}>
        Go to the next stage
      </Button>
    </Stack>
  );
};
