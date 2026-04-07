import React from 'react';
import { useTranslation } from 'react-i18next';
import { BsLinkedin, BsGithub, BsCodeSlash, BsWindow } from 'react-icons/bs';
import { FcCommandLine, FcBriefcase, FcFeedback } from 'react-icons/fc';
import teaImage from '../assets/logoTEA_PNG.png';
import '../App.css';

const Tea = () => {
  const { t } = useTranslation();
  return (
    <div className="portfolio-content" style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '4rem' }}>
      
      {/* 🚀 HERO SECTION */}
      <section className="page-hero">
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <img src={teaImage} alt="TEA Logo" style={{ width: '120px', height: 'auto', marginBottom: '1.5rem', filter: 'drop-shadow(0 10px 15px rgba(99, 102, 241, 0.2))' }} />
        </div>
        <h1 className="page-hero-title">TEA - Track Everything App</h1>
        <p className="page-hero-subtitle">
          {t('tea.heroSubtitle')}
          <br />
          {t('tea.by')} <strong style={{ color: 'var(--primary)' }}>Gui Balestro</strong>
          <br />
          <br />
          <a href="https://github.com/gbalestro/TEA/blob/main/README.md" target="_blank" rel="noopener noreferrer" style={{ display: 'block', fontWeight: '600', marginTop: '0.25rem' }}>
            {t('tea.viewReadme')}
          </a>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700', color: 'var(--primary)' }}>{t('tea.documentation')}</span>
        </p>
      </section>

      {/* 🛠️ PROJECT OVERVIEW */}
      <div className="card-premium">
        <h3 style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', gap: '0.75rem' }}>
          <FcCommandLine style={{ fontSize: '2rem' }} /> {t('tea.architecture')}
        </h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          {t('tea.architectureDetails')}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'var(--background)', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <h5 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>
              <BsWindow /> {t('tea.frontend')}
            </h5>
            <span style={{ fontSize: '0.875rem' }}>React 19 + Vite + Bootstrap 5 + Vanilla CSS</span>
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'var(--background)', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <h5 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', marginBottom: '0.5rem' }}>
              <BsCodeSlash /> {t('tea.backend')}
            </h5>
            <span style={{ fontSize: '0.875rem' }}>Django 5 + REST Framework + SQLite3</span>
          </div>
        </div>
      </div>

      {/* 🕵️ ABOUT THE CREATORS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        
        {/* PERSONAL PROFILE */}
        <div className="card-premium">
          <h3 style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', gap: '0.75rem' }}>
            <FcBriefcase style={{ fontSize: '2rem' }} /> {t('tea.profile')}
          </h3>
          <p style={{ fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            {t('tea.profileDetails')}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            <a href="https://linkedin.com/in/guilherme-balestro" target="_blank" rel="noopener noreferrer" className="tea-button-primary" style={{ gap: '0.5rem' }}>
              <BsLinkedin /> {t('tea.linkedinGui')}
            </a>
            <a href="https://github.com/gbalestro" target="_blank" rel="noopener noreferrer" className="tea-button-secondary" style={{ gap: '0.5rem' }}>
              <BsGithub /> {t('tea.githubGui')}
            </a>
          </div>
        </div>

        {/* TEAM & COLLABORATION */}
        <div className="card-premium">
          <h3 style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', gap: '0.75rem' }}>
            <FcFeedback style={{ fontSize: '2rem' }} /> {t('tea.collaboration')}
          </h3>
          <p style={{ fontSize: '0.95rem', marginBottom: '1.5rem' }}>
            {t('tea.collaborationDetails')}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            <a href="https://linkedin.com/in/jpgaelzer" target="_blank" rel="noopener noreferrer" className="tea-button-primary" style={{ gap: '0.5rem' }}>
              <BsLinkedin /> {t('tea.linkedinJoao')}
            </a>
            <a href="https://github.com/Mordedordelapis" target="_blank" rel="noopener noreferrer" className="tea-button-secondary" style={{ gap: '0.5rem' }}>
              <BsGithub /> {t('tea.githubJoao')}
            </a>
          </div>
        </div>

      </div>

      <p style={{ textAlign: 'center', marginTop: '3rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
        {t('tea.footer')}
      </p>

    </div>
  );
};

export default Tea;
