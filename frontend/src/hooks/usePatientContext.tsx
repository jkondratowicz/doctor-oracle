import React, { createContext, useContext } from 'react';
import { useStickyState } from './useStickyState';

enum AppMode {
  normal,
  demo,
}

interface IPatientContext {
  mode: AppMode;
  setMode: (_: AppMode) => void;
  secretString: string;
  setSecretString: (_: string) => void;
}

export const defaultPatientContext: IPatientContext = {
  mode: AppMode.normal,
  setMode: () => {},
  secretString: '',
  setSecretString: () => {},
};

export const PatientContext = createContext<IPatientContext>(defaultPatientContext);

export const PatientContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useStickyState<AppMode>(AppMode.normal, 'doctor-oracle-game-mode');
  const [secretString, setSecretString] = useStickyState<string>('', 'doctor-oracle-secret-string');

  return <PatientContext.Provider value={{ mode, setMode, secretString, setSecretString }}>{children}</PatientContext.Provider>;
};

export const usePatientContext = () => useContext(PatientContext);
