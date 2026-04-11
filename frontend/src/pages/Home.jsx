import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { 
  People, 
  GeoAlt, 
  BarChart as BarChartIcon, 
  ArrowRightCircleFill,
  PlusCircleFill,
  ClockFill
} from 'react-bootstrap-icons';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { ChevronDown, ChevronUp, BarChartSteps } from 'react-bootstrap-icons';
import { Collapse } from 'react-bootstrap';

import '../App.css';


const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [counts, setCounts] = useState({ people: 0, locations: 0, hours: 0 });
  const [chartData, setChartData] = useState({ daily: [], venues: [] });
  const [loading, setLoading] = useState(true);
  const [showCharts, setShowCharts] = useState(true);



  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const pRes = await axios.get(`${API_BASE}/people/`);
      const lRes = await axios.get(`${API_BASE}/locations/`);
      
      const today = new Date();
      // Fetch last 30 days for better trend visualization
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);
      
      const sd = thirtyDaysAgo.toISOString().split('T')[0];
      const ed = today.toISOString().split('T')[0];
      
      const rRes = await axios.get(`${API_BASE}/logs/report/`, {
        params: { start_date: sd, end_date: ed }
      });

      const logs = rRes.data.raw_logs || [];
      
      // 1. Process Daily Trend
      const dailyMap = {};
      logs.forEach(log => {
        const date = log.clock_in.split('T')[0];
        const inTime = new Date(log.clock_in);
        const outTime = log.clock_out ? new Date(log.clock_out) : new Date();
        const hrs = (outTime - inTime) / (1000 * 60 * 60);
        
        dailyMap[date] = (dailyMap[date] || 0) + hrs;
      });

      const daily = Object.keys(dailyMap).sort().map(date => ({
        date: date.split('-').reverse().slice(0, 2).join('/'), // DD/MM (Irish Format)
        hours: parseFloat(dailyMap[date].toFixed(1))
      }));


      // 2. Process Venue Distribution
      const venueMap = {};
      logs.forEach(log => {
        const inTime = new Date(log.clock_in);
        const outTime = log.clock_out ? new Date(log.clock_out) : new Date();
        const hrs = (outTime - inTime) / (1000 * 60 * 60);
        
        venueMap[log.location_name] = (venueMap[log.location_name] || 0) + hrs;
      });

      const venues = Object.keys(venueMap).map(name => ({
        name,
        value: parseFloat(venueMap[name].toFixed(1))
      })).sort((a,b) => b.value - a.value).slice(0, 5); // Top 5 venues

      setChartData({ daily, venues });
      setCounts({
        people: pRes.data.length || 0,
        locations: lRes.data.length || 0,
        hours: rRes.data.total_hours || 0
      });

    } catch (error) {
      console.error("Erro ao carregar os dados da Dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];


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
                <BarChartIcon className="text-warning-emphasis opacity-50" size={24} />
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

      {/* 📊 ANALYTICS SECTION */}
      <div className="mb-4">
        <div 
          className="d-flex justify-content-between align-items-center cursor-pointer p-3 bg-white border rounded-4 shadow-sm mb-3" 
          onClick={() => setShowCharts(!showCharts)}
          style={{ cursor: 'pointer' }}
        >
          <div className="d-flex align-items-center gap-3">
            <div className="bg-info-subtle p-2 rounded-3">
              <BarChartSteps className="text-info" size={24} />
            </div>
            <h5 className="fw-bold mb-0 text-uppercase small letter-spacing-1">{t('dashboard.visualCharts')}</h5>
          </div>
          {showCharts ? <ChevronUp className="text-muted" /> : <ChevronDown className="text-muted" />}
        </div>

        <Collapse in={showCharts}>
          <div>
            <Row className="g-4 mb-5">
              <Col lg={8}>
                <div className="card-premium h-100 border shadow-sm p-4 rounded-4 bg-white">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-bold text-uppercase small letter-spacing-1 mb-0">{t('dashboard.dailyPerformance')}</h5>
                    <span className="badge bg-primary-subtle text-primary border-0 px-2 py-1">{t('dashboard.hoursPerDay')}</span>
                  </div>
                  <div style={{ width: '100%', height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData.daily}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="date" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 12, fill: '#94a3b8' }}
                          minTickGap={20}
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 12, fill: '#94a3b8' }} 
                        />
                        <Tooltip 
                          cursor={{ fill: '#f8fafc' }}
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                        />
                        <Bar 
                          dataKey="hours" 
                          fill="#6366f1" 
                          radius={[4, 4, 0, 0]} 
                          barSize={20}
                          animationDuration={1500}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </Col>
              
              <Col lg={4}>
                <div className="card-premium h-100 border shadow-sm p-4 rounded-4 bg-white">
                  <h5 className="fw-bold text-uppercase small letter-spacing-1 mb-4">{t('dashboard.venueDistribution')}</h5>
                  <div style={{ width: '100%', height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData.venues}
                          cx="50%"
                          cy="45%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          animationDuration={1500}
                        >
                          {chartData.venues.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                        />
                        <Legend 
                          verticalAlign="bottom" 
                          align="center"
                          iconType="circle"
                          formatter={(value) => <span className="small text-muted fw-bold">{value}</span>}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Collapse>
      </div>



      {/* 💡 SYSTEM ADVICE */}
      <div className="card-premium p-3 bg-light border-0 d-inline-block rounded-3 small">
        <span className="badge bg-success border-0 me-2 p-1">{t('dashboard.systemOnline')}</span>
        <span className="text-muted">{t('dashboard.systemStatus')}</span>
      </div>

    </div>
  );
};

export default Home;