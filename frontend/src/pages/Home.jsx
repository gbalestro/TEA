import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { 
  People, 
  GeoAlt, 
  BarChart, 
  ArrowRightCircleFill,
  PlusCircleFill,
  ClockFill
} from 'react-bootstrap-icons';
import axios from 'axios';
import '../App.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [counts, setCounts] = useState({ people: 0, locations: 0, hours: 0 });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const pRes = await axios.get(`${API_BASE}/people/`);
      const lRes = await axios.get(`${API_BASE}/locations/`);
      
      const today = new Date();
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      const sd = firstDay.toISOString().split('T')[0];
      const ed = today.toISOString().split('T')[0];
      
      const rRes = await axios.get(`${API_BASE}/logs/report/`, {
        params: { start_date: sd, end_date: ed }
      });

      setCounts({
        people: pRes.data.length || 0,
        locations: lRes.data.length || 0,
        hours: rRes.data.total_hours || 0
      });

    } catch (error) {
      console.error("Erro ao carregar os dados da Dashboard:", error);
    }
  };

  return (
    <div className="home-dashboard px-4 py-3">
      
      {/* 🚀 WELCOME SECTION */}
      <div className="mb-5 mt-3">
        <h2 className="fw-bold fs-1" style={{ color: 'var(--text-h)' }}>{t('dashboard.title')}</h2>
        <p className="text-muted fs-5">{t('dashboard.subtitle')}</p>
      </div>

      {/* 🛠️ QUICK ACCESS / LAUNCHER CARDS */}
      <Row className="g-4 mb-5">
        
        {/* CARD: PESSOAS */}
        <Col md={6} lg={4}>
          <div 
            className="card-premium p-4 border shadow-sm h-100 d-flex flex-column justify-content-between rounded-4 transition-transform hover-scale"
            style={{ cursor: 'pointer', borderLeft: '6px solid var(--primary)' }}
            onClick={() => navigate('/people')}
          >
            <div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="bg-primary-subtle p-3 rounded-circle">
                  <People className="text-primary" size={32} />
                </div>
                <PlusCircleFill className="text-primary-emphasis opacity-50" size={24} />
              </div>
              <h2 className="fw-bold mb-1">{counts.people}</h2>
              <h5 className="text-muted uppercase small fw-bold">{t('dashboard.registeredPeople')}</h5>
            </div>
            <div className="mt-4 pt-3 border-top d-flex align-items-center gap-2 text-primary fw-600">
               {t('dashboard.manageTeam')} <ArrowRightCircleFill />
            </div>
          </div>
        </Col>

        {/* CARD: LOCAIS */}
        <Col md={6} lg={4}>
          <div 
            className="card-premium p-4 border shadow-sm h-100 d-flex flex-column justify-content-between rounded-4 transition-transform hover-scale"
            style={{ cursor: 'pointer', borderLeft: '6px solid var(--success)' }}
            onClick={() => navigate('/venues')}
          >
            <div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="bg-success-subtle p-3 rounded-circle">
                  <GeoAlt className="text-success" size={32} />
                </div>
                <PlusCircleFill className="text-success-emphasis opacity-50" size={24} />
              </div>
              <h2 className="fw-bold mb-1">{counts.locations}</h2>
              <h5 className="text-muted uppercase small fw-bold">{t('dashboard.activeVenues')}</h5>
            </div>
            <div className="mt-4 pt-3 border-top d-flex align-items-center gap-2 text-success fw-600">
               {t('dashboard.manageVenues')} <ArrowRightCircleFill />
            </div>
          </div>
        </Col>

        {/* CARD: RELATÓRIOS */}
        <Col md={12} lg={4}>
          <div 
            className="card-premium p-4 border shadow-sm h-100 d-flex flex-column justify-content-between rounded-4 transition-transform hover-scale"
            style={{ cursor: 'pointer', borderLeft: '6px solid var(--warning)' }}
            onClick={() => navigate('/reports')}
          >
            <div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="bg-warning-subtle p-3 rounded-circle">
                  <ClockFill className="text-warning" size={32} />
                </div>
                <BarChart className="text-warning-emphasis opacity-50" size={24} />
              </div>
              <h2 className="fw-bold mb-1">{counts.hours.toFixed(1)}h</h2>
              <h5 className="text-muted uppercase small fw-bold text-truncate">{t('dashboard.workedThisMonth')}</h5>
            </div>
            <div className="mt-4 pt-3 border-top d-flex align-items-center gap-2 text-warning fw-600">
               {t('dashboard.viewReports')} <ArrowRightCircleFill />
            </div>
          </div>
        </Col>

      </Row>

      {/* 💡 SYSTEM ADVICE */}
      <div className="card-premium p-3 bg-light border-0 d-inline-block rounded-3 small">
        <span className="badge bg-success border-0 me-2 p-1">{t('dashboard.systemOnline')}</span>
        <span className="text-muted">{t('dashboard.systemStatus')}</span>
      </div>

    </div>
  );
};

export default Home;