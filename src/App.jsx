import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { auth } from './lib/firebase';
import { initializeRevenueCat, checkProEntitlement } from './lib/revenuecat';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Repository from './pages/Repository';
import { Globe, MessageCircle, AlertTriangle } from 'lucide-react';

// Language Context
const LanguageContext = createContext();
export const useLanguage = () => useContext(LanguageContext);

// Auth Context
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// Subscription Context
const SubscriptionContext = createContext();
export const useSubscription = () => useContext(SubscriptionContext);

const translations = {
  en: {
    loading: 'Loading...',
    sanctuary: 'Sanctuary',
    subtitle: 'Code in peace. Create with purpose.',
    feedback: 'Feedback',
    error: 'Report Bug',
    language: 'Language'
  },
  ja: {
    loading: '読み込み中...',
    sanctuary: 'サンクチュアリ',
    subtitle: 'コードに集中。創造に没頭。',
    feedback: 'フィードバック',
    error: 'バグ報告',
    language: '言語'
  }
};

function ErrorReporter() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="error-reporter-trigger"
        title={t.error}
      >
        <AlertTriangle size={14} />
      </button>
      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Report an Issue</h3>
            <textarea 
              placeholder="Describe the bug or issue..." 
              rows={4}
            />
            <div className="modal-actions">
              <button onClick={() => setIsOpen(false)}>Cancel</button>
              <button className="btn-primary">Send Report</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="feedback-widget"
        title={t.feedback}
      >
        <MessageCircle size={16} />
      </button>
      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Share Your Thoughts</h3>
            <textarea 
              placeholder="What would make RepoSanctuary better for you?" 
              rows={4}
            />
            <div className="modal-actions">
              <button onClick={() => setIsOpen(false)}>Cancel</button>
              <button className="btn-primary">Send Feedback</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'ja' : 'en')}
      className="language-toggle"
      title={t.language}
    >
      <Globe size={14} />
      <span>{language.toUpperCase()}</span>
    </button>
  );
}

function LoadingScreen() {
  const { t } = useLanguage();
  
  return (
    <div className="loading-screen">
      <div className="loading-glow" />
      <div className="loading-content">
        <div className="loading-spinner" />
        <h1>{t.loading}</h1>
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('en');
  
  const t = translations[language];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        
        // Initialize RevenueCat with the user ID
        try {
          await initializeRevenueCat(user.uid);
          // Check subscription status
          const hasEntitlement = await checkProEntitlement();
          setIsPro(hasEntitlement);
        } catch (error) {
          console.error('Error with RevenueCat:', error);
          setIsPro(false);
        }
      } else {
        // Sign in anonymously if no user
        try {
          await signInAnonymously(auth);
        } catch (error) {
          console.error('Anonymous auth failed:', error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <LanguageContext.Provider value={{ language, setLanguage, t }}>
        <LoadingScreen />
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <AuthContext.Provider value={{ user, setUser }}>
        <SubscriptionContext.Provider value={{ isPro, setIsPro }}>
          <Router>
            <div className="app">
              <div className="app-glow-top" />
              <div className="app-glow-bottom" />
              
              <Header />
              
              <main className="app-main">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Navigate to="/" replace />} />
                  <Route path="/repo/:owner/:name" element={<Repository />} />
                  <Route path="/repo/:owner/:name/*" element={<Repository />} />
                </Routes>
              </main>
              
              <div className="app-widgets">
                <LanguageToggle />
                <FeedbackWidget />
                <ErrorReporter />
              </div>
            </div>
          </Router>
        </SubscriptionContext.Provider>
      </AuthContext.Provider>
    </LanguageContext.Provider>
  );
}

export default App;