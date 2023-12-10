import {
  Card,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  Textarea,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

interface SurveyQuestionProps {
  question: string;
  value?: any;
  setValue: (v: any) => void;
  type: 'number' | 'choice' | 'choiceWithOther' | 'textarea' | 'optionalTextarea';
  toggle?: boolean;
  helpText?: string;
  min?: number;
  max?: number;
  options?: string[];
  followUpQuestion?: string;
  xl?: boolean;
}

export const SurveyQuestion = ({ value, setValue, type, toggle, question, helpText, min, max, options, followUpQuestion, xl }: SurveyQuestionProps) => {
  const [isDeclined, setDeclined] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  useEffect(() => {
    if (isDeclined) {
      setLocalValue(value);
      setValue(undefined);
    } else {
      setValue(localValue);
    }
  }, [isDeclined]);

  const renderInput = () => {
    switch (type) {
      case 'number':
        return renderNumberInput();
      case 'choice':
        return renderChoiceInput(false);
      case 'choiceWithOther':
        return renderChoiceInput(true);
      case 'textarea':
        return renderTextarea();
      case 'optionalTextarea':
        return renderOptionalTextarea();
      default:
    }
  };

  const renderNumberInput = () => {
    return (
      <>
        <NumberInput min={min} max={max} value={value ?? undefined} onChange={(_, valueAsNumber) => setValue(valueAsNumber)}>
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        {helpText && <FormHelperText>{helpText}</FormHelperText>}
      </>
    );
  };

  const renderChoiceInput = (allowOther: boolean) => {
    return (
      <>
        <RadioGroup value={options?.includes(value) ? value : !value ? value : 'Other'}>
          <Stack>
            {options?.map((option, idx) => (
              <Radio size="lg" value={option} key={idx} onChange={(e) => setValue(e.target.value)}>
                {option}
              </Radio>
            ))}
            {allowOther && (
              <Radio size="lg" value={'Other'} key={'other'} onChange={(e) => setValue(e.target.value)}>
                Other (please specify)
              </Radio>
            )}
          </Stack>
          {allowOther && !options?.includes(value) && value !== undefined && (
            <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Please specify" mt={4} />
          )}
        </RadioGroup>
        {helpText && <FormHelperText>{helpText}</FormHelperText>}
      </>
    );
  };

  const renderTextarea = () => {
    return (
      <>
        <Textarea placeholder={'You can type your answer here.'} value={value} onChange={(e) => setValue(e.target.value)} size="lg" rows={xl ? 7 : 3} />
        {helpText && <FormHelperText>{helpText}</FormHelperText>}
      </>
    );
  };

  const renderOptionalTextarea = () => {
    return (
      <>
        <RadioGroup value={value === undefined ? 'No' : 'Yes'}>
          <Stack>
            <Radio size="lg" value={'No'} onChange={() => setValue(undefined)}>
              No
            </Radio>
            <Radio size="lg" value={'Yes'} onChange={() => setValue('')}>
              Yes
            </Radio>
          </Stack>
        </RadioGroup>
        {value !== undefined && (
          <>
            <FormLabel mt={4}>{followUpQuestion}</FormLabel>
            <Textarea size="lg" value={value} onChange={(e) => setValue(e.target.value)} placeholder={followUpQuestion} mt={4} />
          </>
        )}
        {helpText && <FormHelperText>{helpText}</FormHelperText>}
      </>
    );
  };

  return (
    <Card bg="gray.100" p={4} rounded="md">
      <FormControl>
        <FormLabel fontSize={'lg'}>{question}</FormLabel>
        {toggle && (
          <FormControl display="flex" alignItems="center" my={4}>
            <Switch id="age-switch" onChange={(e) => setDeclined(!!e?.target?.checked)} />
            <FormLabel htmlFor="age-switch" mb="1" ml={2}>
              I prefer not to answer this question.
            </FormLabel>
          </FormControl>
        )}
        {((toggle && !isDeclined) || !toggle) && renderInput()}
      </FormControl>
    </Card>
  );
};
