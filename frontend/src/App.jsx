import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Loading from './components/common/Loading';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
const Vocabulary = lazy(() => import('./pages/Vocabulary'));
const VocabularyDetail = lazy(() => import('./pages/VocabularyDetail'));
const Specialized = lazy(() => import('./pages/Specialized'));
const Grammar = lazy(() => import('./pages/Grammar'));
const Conversation = lazy(() => import('./pages/Conversation'));
const Listening = lazy(() => import('./pages/Listening'));
const Quiz = lazy(() => import('./pages/Quiz'));
const Practice = lazy(() => import('./pages/Practice'));
const Progress = lazy(() => import('./pages/Progress'));
const Settings = lazy(() => import('./pages/Settings'));
const NotFound = lazy(() => import('./pages/NotFound'));
import './App.css';

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="vocabulary" element={<Vocabulary />} />
        <Route path="vocabulary/:id" element={<VocabularyDetail />} />
        <Route path="specialized" element={<Specialized />} />
        <Route path="grammar" element={<Grammar />} />
        <Route path="conversation" element={<Conversation />} />
        <Route path="listening" element={<Listening />} />
        <Route path="practice" element={<Practice />} />
        <Route path="quiz" element={<Quiz />} />
        <Route path="progress" element={<Progress />} />
        <Route path="settings" element={<Settings />} />
        <Route path="home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
    </Suspense>
  );
}
