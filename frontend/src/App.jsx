import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
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
  SunFill
} from 'react-bootstrap-icons';
import './App.css';

import Home from './pages/Home';
import Registration from './pages/Registration';
import Tea from './pages/Tea';
import People from './pages/People';
import Venues from './pages/Venues';
import Reports from './pages/Reports';

function App() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [theme, setTheme] = useState(localStorage.getItem('tea_theme') || 'light');

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
      default: return { title: 'Page', icon: <InfoCircle /> };
    }
  };

  const { title } = getPageConfig(location.pathname);

  return (
    <div className="app-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <CupHot />
          </div>
          TEA
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Speedometer2 className="sidebar-link-icon" />
            <span>{t('sidebar.dashboard')}</span>
          </NavLink>

          <NavLink to="/registration" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <ClipboardData className="sidebar-link-icon" />
            <span>{t('sidebar.registration')}</span>
          </NavLink>

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

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', opacity: '0.9', padding: '0 0.5rem' }}>
            <div style={{ width: '36px', height: '36px', backgroundColor: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PersonCircle style={{ fontSize: '1.25rem' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>{t('sidebar.adminUser')}</span>
              <span style={{ fontSize: '0.75rem', opacity: '0.6' }}>{t('sidebar.viewProfile')}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="main-content">
        <header className="header">
          <div className="header-breadcrumb">
            <span className="header-parent">TEA System</span>
            <span className="header-separator">/</span>
            <span className="header-current">{title}</span>
          </div>
        </header>

        <section className="page-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/about" element={<Tea />} />
            <Route path="/people" element={<People />} />
            <Route path="/venues" element={<Venues />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </section>
      </main>
    </div>
  );
}

export default App;