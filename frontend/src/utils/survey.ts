export interface EncryptedResponse {
  encryptedAesKey: string;
  encryptedData: string;
  iv: string;
}
export const steps = [
  { title: 'Step 1', description: 'Consent' },
  { title: 'Step 2', description: 'About you' },
  { title: 'Step 3', description: 'Your health and fitness' },
  { title: 'Step 4', description: 'How can I help?' },
  { title: 'Step 5', description: 'Ask Doctor Oracle' },
];

export interface MedicalSurvey {
  age?: number;
  sex?: string;
  lifestyle?: string;

  healthAndFitness?: string;
  diagnosedConditions?: string;
  prescriptionMedications?: string;
  allergies?: string;

  injuryRelated?: string;
  previousConsultation?: string;
  symptoms?: string;
}

export interface InterviewStageProps {
  setValue: (key: string, value: any) => void;
  data: MedicalSurvey;
  nextStep: () => void;
}

const PREFER_NO_ANSWER = 'I prefer not to answer.';
const NO_ANSWER = 'No.';
export const convertMedicalSurveyToQA = (data: MedicalSurvey) => {
  const qa = [];
  // stage 1
  qa.push({ question: 'What is your age?', answer: data.age ? data.age.toString() : PREFER_NO_ANSWER });
  qa.push({ question: 'What is your sex?', answer: data.sex ? data.sex : PREFER_NO_ANSWER });
  qa.push({ question: 'Please describe your general level of activity.', answer: data.lifestyle ? data.lifestyle : PREFER_NO_ANSWER });

  // stage 2
  qa.push({
    question: 'Please describe your general health and fitness level.',
    answer: data.healthAndFitness ? data.healthAndFitness : PREFER_NO_ANSWER,
  });
  qa.push({
    question: 'Have you been diagnosed with any chronic conditions?',
    answer: data.diagnosedConditions ? data.diagnosedConditions : NO_ANSWER,
  });
  qa.push({
    question: 'Are you currently taking and prescription medication?',
    answer: data.prescriptionMedications ? data.prescriptionMedications : NO_ANSWER,
  });
  qa.push({
    question: 'Are you allergic to any drugs, or have other allergies?',
    answer: data.allergies ? data.allergies : NO_ANSWER,
  });

  // stage 3
  qa.push({
    question: 'Is the reason for your consultation related to a recently sustained injury?',
    answer: data.injuryRelated ? data.injuryRelated : NO_ANSWER,
  });
  qa.push({
    question: 'Have you already consulted a medical professional about your predicament before?',
    answer: data.previousConsultation ? data.previousConsultation : NO_ANSWER,
  });
  qa.push({
    question: 'Please describe in detail the symptoms you are experiencing.',
    answer: data.symptoms ? data.symptoms : PREFER_NO_ANSWER,
  });

  return qa;
};

export const qaToPrompt = (qa: { question: string; answer: string }[]) => {
  const conversation = [
    {
      role: 'system',
      content:
        "You are an Large Language Model assistant specializing in providing accurate medical advice to members of underserved communities, who don't have access to qualified healthcare professionals. You provide advice and help users diagnose any medical issues they might have based on the symptoms they describe. You are always sure to only provide advice based on current consensus of the medical establishment. Before prosposing any treatment, always make sure to recommend user seeks professional medical care. In case the symptoms described by the user point to a serious health issue that could potentially be life threatening, categorically ask the user to immediately seek professional help. If problems or symptoms described are not conclusively pointing to a single cause, list all potential reasons with appropriate explanations how they could be tied to a particular diagnosis. If not enough information is provided to offer an initial diagnosis, ask follow-up questions. Always make sure to include potential treatment options for diagnosed conditions and health issues.",
    },
    {
      role: 'assistant',
      content:
        "Hello, my name is Doctor Oracle. I'm an AI assistant and I'm here to help you diagnose any potential health issues. Please note that information I provide should not be treated as medical advice and is only for informational purposes. If you are experiencing serious medical symptoms, please seek help from qualified medical professionals.",
    },
    { role: 'user', content: 'Okay!' },
  ];

  qa.forEach(({ question, answer }) => {
    conversation.push({ role: 'assistant', content: question });
    conversation.push({ role: 'user', content: answer });
  });

  return conversation;
};
