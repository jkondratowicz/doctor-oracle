import { Routes, Route } from 'react-router-dom';
import { IntroPage } from './pages/IntroPage.tsx';
import { MedicalInterviewPage } from './pages/MedicalInterviewPage.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { ErrorPage } from './pages/ErrorPage.tsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/introduction" element={<IntroPage />} />
      <Route path="/interview" element={<MedicalInterviewPage />} />
      <Route path="*" element={<ErrorPage code={404} />} />
    </Routes>
  );
}

export default App;
