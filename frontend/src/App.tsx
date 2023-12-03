import { Routes, Route } from 'react-router-dom';
import { WagmiConfig, createConfig, configureChains } from 'wagmi';
import { infuraProvider } from 'wagmi/providers/infura';
import { publicProvider } from 'wagmi/providers/public';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { polygonMumbai } from 'viem/chains';
import { IntroPage } from './pages/IntroPage.tsx';
import { MedicalInterviewPage } from './pages/MedicalInterviewPage.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { ErrorPage } from './pages/ErrorPage.tsx';
import { FAQPage } from './pages/FAQPage.tsx';
import { Layout } from './components/Layout.tsx';

function App() {
  const { chains, publicClient, webSocketPublicClient } = configureChains(
    [polygonMumbai],
    [infuraProvider({ apiKey: import.meta.env.VITE_INFURA_API_KEY }), publicProvider()]
  );

  // Set up wagmi config
  const config = createConfig({
    autoConnect: true,
    connectors: [
      new MetaMaskConnector({ chains }),
      new InjectedConnector({
        chains,
        options: {
          name: 'Injected',
          shimDisconnect: true,
        },
      }),
    ],
    publicClient,
    webSocketPublicClient,
  });

  return (
    <WagmiConfig config={config}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route element={<Layout />}>
          <Route path="/introduction" element={<IntroPage />} />
          <Route path="/interview" element={<MedicalInterviewPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="*" element={<ErrorPage code={404} />} />
        </Route>
      </Routes>
    </WagmiConfig>
  );
}

export default App;
