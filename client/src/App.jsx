import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Eager loaded pages
import Home from './pages/Home';
import EventsPage from './pages/EventsPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import SecurityAuditPage from './pages/SecurityAuditPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';

// Performance Optimization (Exp 5 Step 16): Lazy load heavy image gallery
const GalleryPage = lazy(() => import('./pages/GalleryPage'));

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Navbar />
              <main style={{ flex: 1 }}>
                <Suspense
                  fallback={
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--primary)', fontWeight: 600 }}>
                      ⚡ Loading component (React.lazy)...
                    </div>
                  }
                >
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/events" element={<EventsPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/gallery" element={<GalleryPage />} />
                    <Route path="/security-audit" element={<SecurityAuditPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </Suspense>
              </main>
              <Footer />
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
