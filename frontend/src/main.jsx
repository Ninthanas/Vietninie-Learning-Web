import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import './assets/styles/global.css';
import './assets/styles/home.css';
import './assets/styles/vocabulary.css';
import './assets/styles/quiz.css';
import './assets/styles/grammar.css';
import './assets/styles/specialized.css';
import './assets/styles/responsive.css';
import './assets/styles/chat.css';
import './assets/styles/theme-game.css';
import './assets/styles/redesign.css';
import './index.css';
import App from './App';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { UIProvider } from './context/UIContext';
import { initAudio } from './services/audio';

initAudio();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <LanguageProvider>
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <UIProvider>
                <App />
              </UIProvider>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </LanguageProvider>
    </HashRouter>
  </React.StrictMode>
);
