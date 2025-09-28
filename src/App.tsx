import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { hydrateDemo } from './lib/storage';
import { ThemeProvider } from './contexts/ThemeContext';
import TopNav from './components/TopNav';
import BottomBar from './components/BottomBar';
import NotificationToast from './components/ui/NotificationToast';
import { SupportButton } from './components/SupportButton';
import { AdvisorContactButton } from './components/AdvisorContactButton';
import Feed from './pages/Feed';
import ReelDetail from './pages/ReelDetail';
import Courses from './pages/Courses';
import CourseFeed from './pages/CourseFeed';
import Ask from './pages/Ask';
import Upload from './pages/Upload';
import Profile from './pages/Profile';
import Jobs from './pages/Jobs';
import SimpleSignup from './pages/SimpleSignup';
import VerifyEmail from './pages/VerifyEmail';

function App() {
  useEffect(() => {
    // Hydrate demo data on first load
    console.log('App - Hydrating demo data...');
    hydrateDemo();
    console.log('App - Demo data hydrated');
  }, []);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-light dark:bg-gradient-dark transition-colors duration-300">
        <TopNav />
        
        <main className="pb-16 md:pb-0">
          <AnimatePresence mode="wait">
            <Routes>
              <Route 
                path="/" 
                element={<Navigate to="/feed" replace />}
              />
              <Route 
                path="/feed" 
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                  >
                    <Feed />
                  </motion.div>
                } 
              />
              <Route 
                path="/reel/:id" 
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                  >
                    <ReelDetail />
                  </motion.div>
                } 
              />
              <Route 
                path="/courses" 
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                  >
                    <Courses />
                  </motion.div>
                } 
              />
              <Route 
                path="/courses/:courseId" 
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                  >
                    <CourseFeed />
                  </motion.div>
                } 
              />
              <Route 
                path="/ask" 
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                  >
                    <Ask />
                  </motion.div>
                } 
              />
              <Route 
                path="/upload" 
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                  >
                    <Upload />
                  </motion.div>
                } 
              />
              <Route 
                path="/profile/:username" 
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                  >
                    <Profile />
                  </motion.div>
                } 
              />
              <Route 
                path="/jobs" 
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                  >
                    <Jobs />
                  </motion.div>
                } 
              />
              <Route 
                path="/signup" 
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                  >
                    <SimpleSignup />
                  </motion.div>
                } 
              />
              <Route 
                path="/verify" 
                element={
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                  >
                    <VerifyEmail />
                  </motion.div>
                } 
              />
            </Routes>
          </AnimatePresence>
        </main>

        <BottomBar />
        <NotificationToast />
        <SupportButton />
        <AdvisorContactButton />
      </div>
    </ThemeProvider>
  );
}

export default App;
