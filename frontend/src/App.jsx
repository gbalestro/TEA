import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Routes, Route, NavLink, useLocation, Navigate, useNavigate } from 'react-router-dom';
import {
  Speedometer2,
  ClipboardData,
  People as PeopleIcon,
  GeoAlt,
  BarChart,
  CupHot,
  PersonCircle,
  InfoCircle,
  MoonFill,
  SunFill,
  List,
  X,
  ShieldCheck,
  BoxArrowRight
} from 'react-bootstrap-icons';
import './App.css';
import { useAuth } from './context/AuthContext';

import Home from './pages/Home';
import Registration from './pages/Registration';
import Tea from './pages/Tea';
import People from './pages/People';
import Venues from './pages/Venues';
import Reports from './pages/Reports';
import Login from './pages/Login';
import Users from './pages/Users';

// Higher order component for route protection
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, loading, user } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" />;
  
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" />;
  }
  
  return children;
};

function App() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [theme, setTheme] = useState(localStorage.getItem('tea_theme') || 'light');
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const isLoginPage = location.pathname === '/login';

  // Role check helpers
  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager' || isAdmin;
  const isStaff = user?.role === 'staff' && !isManager;

  // Staff redirect logic: if staff lands on / or dashboard, go to registration
  useEffect(() => {
    if (isAuthenticated && isStaff && (location.pathname === '/' || location.pathname === '/people' || location.pathname === '/reports')) {
      navigate('/registration');
    }
  }, [isAuthenticated, isStaff, location.pathname, navigate]);

  // Close sidebar when route changes
  useEffect(() => {
    setShowMobileSidebar(false);
  }, [location]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('tea_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith('pt') ? 'en' : 'pt';
    i18n.changeLanguage(newLang);
  };

  const getPageConfig = (path) => {
    switch (path) {
      case '/': return { title: 'Dashboard', icon: <Speedometer2 /> };
      case '/registration': return { title: t('sidebar.registration'), icon: <ClipboardData /> };
      case '/about': return { title: t('sidebar.about'), icon: <InfoCircle /> };
      case '/people': return { title: t('sidebar.people'), icon: <PeopleIcon /> };
      case '/venues': return { title: t('sidebar.venues'), icon: <GeoAlt /> };
      case '/reports': return { title: t('sidebar.reports'), icon: <BarChart /> };
      case '/users': return { title: 'Users', icon: <ShieldCheck /> };
      case '/login': return { title: 'Login', icon: <PersonCircle /> };
      default: return { title: 'Page', icon: <InfoCircle /> };
    }
  };

  const { title } = getPageConfig(location.pathname);

  // If we are on the login page, don't show the layout (sidebar/header)
  // BUT allow /about to be accessed with or without login
  if (isLoginPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<Tea />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <div className={`app-container ${showMobileSidebar ? 'mobile-sidebar-open' : ''}`}>
      {/* OVERLAY FOR MOBILE */}
      {showMobileSidebar && (
        <div className="sidebar-overlay" onClick={() => setShowMobileSidebar(false)}></div>
      )}

      {/* SIDEBAR */}
      <aside className={`sidebar ${showMobileSidebar ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <CupHot />
          </div>
          <span className="sidebar-logo-text">TEA</span>
          <button className="sidebar-close-btn" onClick={() => setShowMobileSidebar(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {!isStaff && (
            <NavLink to="/" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Speedometer2 className="sidebar-link-icon" />
              <span>{t('sidebar.dashboard')}</span>
            </NavLink>
          )}

          <NavLink to="/registration" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <ClipboardData className="sidebar-link-icon" />
            <span>{t('sidebar.registration')}</span>
          </NavLink>

          {isManager && (
            <>
              <NavLink to="/people" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <PeopleIcon className="sidebar-link-icon" />
                <span>{t('sidebar.people')}</span>
              </NavLink>

              <NavLink to="/venues" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <GeoAlt className="sidebar-link-icon" />
                <span>{t('sidebar.venues')}</span>
              </NavLink>

              <NavLink to="/reports" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <BarChart className="sidebar-link-icon" />
                <span>{t('sidebar.reports')}</span>
              </NavLink>
            </>
          )}

          {isAdmin && (
            <NavLink to="/users" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <ShieldCheck className="sidebar-link-icon" />
              <span>Usuários</span>
            </NavLink>
          )}

          <div style={{ marginTop: '2rem', marginBottom: '0.5rem', paddingLeft: '1rem', fontSize: '0.75rem', fontWeight: '700', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {t('sidebar.portfolio')}
          </div>

          <NavLink to="/about" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <InfoCircle className="sidebar-link-icon" />
            <span>{t('sidebar.about')}</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div
            className="theme-toggle"
            onClick={toggleTheme}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.5rem 1rem', borderRadius: '8px',
              cursor: 'pointer', backgroundColor: 'rgba(255,255,255,0.05)',
              transition: 'var(--transition)'
            }}
          >
            {theme === 'light' ? <MoonFill size={18} /> : <SunFill size={18} color="#f59e0b" />}
            <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{theme === 'light' ? t('sidebar.darkMode') : t('sidebar.lightMode')}</span>
          </div>

          <div
            className="language-toggle"
            onClick={toggleLanguage}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.5rem 1rem', borderRadius: '8px',
              cursor: 'pointer', backgroundColor: 'rgba(255,255,255,0.05)',
              transition: 'var(--transition)'
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>{i18n.language.startsWith('pt') ? '🇮🇪' : '🇧🇷'}</span>
            <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{i18n.language.startsWith('pt') ? 'English' : 'Português'}</span>
          </div>

          {isAuthenticated ? (
            <div 
              className="user-profile-btn"
              onClick={logout}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '0.75rem', 
                cursor: 'pointer', padding: '0.5rem', borderRadius: '8px',
                backgroundColor: 'rgba(220, 53, 69, 0.1)', border: '1px solid rgba(220, 53, 69, 0.2)'
              }}
            >
              <div style={{ width: '36px', height: '36px', backgroundColor: '#dc3545', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <BoxArrowRight style={{ fontSize: '1.25rem' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#dc3545' }}>Logout</span>
                <span style={{ fontSize: '0.75rem', opacity: '0.6' }}>{user?.username}</span>
              </div>
            </div>
          ) : (
            <div 
              className="user-profile-btn"
              onClick={() => navigate('/login')}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '0.75rem', 
                cursor: 'pointer', padding: '0.5rem', borderRadius: '8px',
                backgroundColor: 'rgba(255,255,255,0.05)'
              }}
            >
              <div style={{ width: '36px', height: '36px', backgroundColor: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PersonCircle style={{ fontSize: '1.25rem' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>Login</span>
                <span style={{ fontSize: '0.75rem', opacity: '0.6' }}>Entrar no sistema</span>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="main-content">
        <header className="header">
          <button className="mobile-menu-toggle" onClick={() => setShowMobileSidebar(true)}>
            <List size={24} />
          </button>
          <div className="header-breadcrumb">
            <span className="header-parent">TEA System</span>
            <span className="header-separator">/</span>
            <span className="header-current">{title}</span>
          </div>
        </header>

        <section className="page-container">
          <Routes>
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/registration" element={<ProtectedRoute><Registration /></ProtectedRoute>} />
            <Route path="/about" element={<Tea />} />
            <Route path="/people" element={<ProtectedRoute><People /></ProtectedRoute>} />
            <Route path="/venues" element={<ProtectedRoute><Venues /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute requiredRole="admin"><Users /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </section>
      </main>
    </div>
  );
}

export default App;