import React, { createContext, useContext, useEffect, useState } from 'react';
import { useStickyState } from './useStickyState';
import { generateKeyPair, exportPublicKey, exportPrivateKey } from '../cryptography.ts';

enum AppMode {
  normal,
  demo,
}

interface IPatientContext {
  mode: AppMode;
  setMode: (_: AppMode) => void;
  publicKey: string;
  privateKey: string;
  signature: string;
  setSignature: (_: string) => void;
}

export const defaultPatientContext: IPatientContext = {
  mode: AppMode.normal,
  setMode: () => {},
  publicKey: '',
  privateKey: '',
  signature: '',
  setSignature: () => {},
};

export const PatientContext = createContext<IPatientContext>(defaultPatientContext);

export const PatientContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useStickyState<AppMode>(AppMode.normal, 'droracle-app-mode');
  const [keystore, setKeyStore] = useStickyState<Record<string, [string, string]>>({}, 'droracle-keystore');
  const [signature, setSignature] = useStickyState<string>('', 'droracle-signature');

  const [privateKey, setPrivateKey] = useState<string>('');
  const [publicKey, setPublicKey] = useState<string>('');

  const getOrCreateKeyPair = async (signature: string) => {
    if (!keystore[signature]) {
      console.log(`No keypair for signature ${signature}, generating...`);
      const keyPairUser = await generateKeyPair();
      const userPublicKey = await exportPublicKey(keyPairUser.publicKey);
      const userPrivateKey = await exportPrivateKey(keyPairUser.privateKey);
      setKeyStore({ ...keystore, [signature]: [userPrivateKey, userPublicKey] });
    } else {
      console.log(`Found a keypair for signature ${signature}`);
    }

    const [pk, pub] = keystore[signature];
    setPrivateKey(pk);
    setPublicKey(pub);
  };

  useEffect(() => {
    if (!signature) {
      return;
    }

    getOrCreateKeyPair(signature)
      .then(() => {
        console.log('Key pair ready');
      })
      .catch((e: any) => {
        console.log('Error getting key pair', e);
      });
  }, [signature, keystore]);

  return <PatientContext.Provider value={{ mode, setMode, publicKey, privateKey, signature, setSignature }}>{children}</PatientContext.Provider>;
};

export const usePatientContext = () => useContext(PatientContext);
