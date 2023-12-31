import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import { PatientContextProvider } from './hooks/usePatientContext.tsx';

const theme = extendTheme({
  colors: {
    brand: {
      darkBlue: '#00283d',
      lightBlue: '#72b9c4',
      orange: '#F9A332',
      green: '#6EC7A4',
      darkRed: '#F55D56',
      lightRed: '#DB7756',
      bgGrey: '#dce0ed',
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <PatientContextProvider>
          <App />
        </PatientContextProvider>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
);
