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

  generalHealth?: number; // 1-5
  diagnosedConditions?: string;
  prescriptionMedications?: string;
  allergies?: string;
  healthAndFitness?: string;

  injuryRelated?: string;
  previousConsultation?: string;
  symptoms?: string;
}

export interface InterviewStageProps {
  setValue: (key: string, value: any) => void;
  data: MedicalSurvey;
  nextStep: () => void;
}
