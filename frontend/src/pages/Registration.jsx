import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Row, Col, Form, Button, Badge } from 'react-bootstrap';
import { 
  CheckCircle,
  People
} from 'react-bootstrap-icons';
import axios from 'axios';
import '../App.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const Registration = () => {
  const { t } = useTranslation();
  const [activeWorkers, setActiveWorkers] = useState([]);
  const [availablePeople, setAvailablePeople] = useState([]);
  const [locationsList, setLocationsList] = useState([]);

  const [selectedPeople, setSelectedPeople] = useState([]);
  const [locationId, setLocationId] = useState('');
  
  // Timing modes
  const [isManualMode, setIsManualMode] = useState(false);
  const [startTime, setStartTime] = useState(''); // Used when isManualMode=true
  const [endTime, setEndTime] = useState('');     // Used when isManualMode=true (Optional Clock-out)

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const peopleRes = await axios.get(`${API_BASE}/people/`);
      setAvailablePeople(peopleRes.data);
      
      const locRes = await axios.get(`${API_BASE}/locations/`);
      setLocationsList(locRes.data);
      if (locRes.data.length > 0 && !locationId) {
        setLocationId(locRes.data[0].id);
      }

      const logsRes = await axios.get(`${API_BASE}/logs/`);
      const activeLogs = logsRes.data.filter(log => !log.is_completed && !log.clock_out);
      
      const formattedWorkers = activeLogs.map(log => {
        const d = new Date(log.clock_in);
        return {
          id: log.id,
          person_id: log.person_details.id,
          nome: log.person_details.name,
          local: log.location_details.name,
          foto: log.person_details.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(log.person_details.name)}&background=6366f1&color=fff`,
          inicio: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          tempo: `🏠 ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` 
        };
      });
      setActiveWorkers(formattedWorkers);
    } catch (error) {
      console.error("Erro ao carregar dados do registro:", error);
    }
  };

  const togglePersonSelection = (id) => {
    if (selectedPeople.includes(id)) {
      setSelectedPeople(selectedPeople.filter(pId => pId !== id));
    } else {
      setSelectedPeople([...selectedPeople, id]);
    }
  };

  const handleClockOut = async (id) => {
    try {
      await axios.post(`${API_BASE}/logs/${id}/clock_out/`);
      fetchData(); // Refresh UI
    } catch (error) {
      console.error("Erro ao fazer clock-out:", error);
    }
  };

  const handleClockOutAll = async () => {
    if(window.confirm("Deseja encerrar o turno de todas as pessoas ativas?")) {
      try {
        await axios.post(`${API_BASE}/logs/clock_out_all/`);
        fetchData();
      } catch (error) {
       console.error("Erro ao finalizar todos:", error);
      }
    }
  };

  const setModeNow = () => {
    setIsManualMode(false);
    setStartTime('');
    setEndTime('');
  };

  const setModeManual = () => {
    setIsManualMode(true);
    // Optional: Pre-fill with current local time
    const nowLocal = new Date();
    // Format to YYYY-MM-DDTHH:MM
    nowLocal.setMinutes(nowLocal.getMinutes() - nowLocal.getTimezoneOffset());
    setStartTime(nowLocal.toISOString().slice(0, 16));
  };

  const handleStartTracking = async () => {
    if (!locationId) {
      alert("Por favor, selecione um local ou deixe cadastrado.");
      return;
    }
    
    // In UTC formatted ISO if needed, but datetime-local sends standard string. 
    // DRF parses standard ISO strings gracefully.
    try {
      await axios.post(`${API_BASE}/logs/clock_in_bulk/`, {
        person_ids: selectedPeople,
        location_id: locationId,
        clock_in: isManualMode ? new Date(startTime).toISOString() : 'Now',
        clock_out: (isManualMode && endTime) ? new Date(endTime).toISOString() : null
      });
      
      setSelectedPeople([]);
      setModeNow();
      fetchData(); // Refresh UI
    } catch (error) {
      console.error("Erro ao registrar no backend:", error);
      alert("Houve um erro ao registrar. Verifique os dados inseridos.");
    }
  };

  return (
    <div className="registro-container px-4 py-3">
      
      {/* B: ACTIVE HEADER TOOLBAR */}
      <div className="card-premium p-3 mb-4 d-flex justify-content-between align-items-center bg-light border shadow-sm" style={{ borderRadius: '12px' }}>
         <div className="d-flex align-items-center gap-2">
            <span className="fw-bold" style={{ fontSize: '1.2rem'}}>TEA / <span className="text-muted">{t('registration.title')}</span></span>
         </div>
         <div className="d-flex align-items-center gap-3">
            <span className="text-muted fw-500">{t('registration.currentlyActive')}: [ <strong className="text-primary">{activeWorkers.length}</strong> ] {t('registration.peopleIn')}</span>
            <Button variant="outline-danger" size="sm" className="fw-bold px-3" onClick={handleClockOutAll} style={{ borderRadius: '8px' }} disabled={activeWorkers.length === 0}>
              {t('registration.clockOutAll')}
            </Button>
         </div>
      </div>

      {/* C1: CURRENTLY WORKING */}
      <div className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold text-uppercase small letter-spacing-1 mb-0">{t('registration.currentlyWorking')}</h5>
        </div>
        <Row className="g-3">
          {activeWorkers.map(worker => (
            <Col key={worker.id} md={4} xl={3}>
              <div className="card-premium p-3 border-0 shadow-sm bg-white rounded-3 h-100 d-flex flex-column justify-content-between">
                <div className="d-flex align-items-start gap-3 mb-3">
                  <img src={worker.foto} alt={worker.nome} className="rounded-circle" style={{ width: '45px', height: '45px', objectFit: 'cover' }} />
                  <div>
                    <h6 className="mb-0 fw-bold">{worker.nome}</h6>
                    <div className="text-muted small">{worker.local}</div>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center mt-2 border-top pt-3">
                  <div className="fw-bold text-secondary" style={{ fontSize: '1rem' }}>{worker.tempo}</div>
                  <Button variant="outline-secondary" size="sm" className="px-3" onClick={() => handleClockOut(worker.id)} style={{ borderRadius: '6px' }}>
                    Clock-out
                  </Button>
                </div>
              </div>
            </Col>
          ))}
          {activeWorkers.length === 0 && (
            <Col md={12}>
              <div className="text-center py-5 text-muted card-premium bg-light border-dashed">
                <People size={32} className="mb-2 text-secondary" />
                <br />
                {t('registration.nobodyWorking')}
              </div>
            </Col>
          )}
        </Row>
      </div>

      {/* C2: NEW ENTRY: WHO-WHERE-WHEN */}
      <div>
        <h5 className="fw-bold text-uppercase small letter-spacing-1 mb-3">{t('registration.newEntry')}</h5>
        <div className="card-premium p-4 border-0 shadow-sm bg-white rounded-4">
          <Row>
            {/* WHO: SELECT PEOPLE */}
            <Col lg={8} className="border-end pe-lg-4">
              <p className="fw-bold small text-muted mb-4 uppercase">{t('registration.selectPeople')}</p>
              
              {availablePeople.length > 0 ? (
                <div className="d-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '20px' }}>
                  {availablePeople.map(person => {
                    const isSelected = selectedPeople.includes(person.id);
                    const avatarSrc = person.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=6366f1&color=fff`;

                    return (
                      <div 
                        key={person.id} 
                        className={`text-center cursor-pointer p-2 rounded-3 transition-all ${isSelected ? 'bg-primary-subtle border border-primary' : 'hover-bg-light'}`}
                        onClick={() => togglePersonSelection(person.id)}
                        style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                      >
                        <div className="position-relative d-inline-block mb-1">
                          <img 
                            src={avatarSrc} 
                            alt={person.name} 
                            className={`rounded-circle border-3 ${isSelected ? 'border-primary' : 'border-transparent'}`}
                            style={{ width: '60px', height: '60px', objectFit: 'cover' }} 
                          />
                          {isSelected && (
                            <div className="position-absolute top-0 end-0 bg-primary rounded-circle border border-white" style={{ width: '20px', height: '20px' }}>
                              <CheckCircle className="text-white w-100 h-100 p-0.5" />
                            </div>
                          )}
                        </div>
                        <div className={`small fw-bold lh-sm text-truncate ${isSelected ? 'text-primary' : 'text-dark'}`} style={{ fontSize: '0.75rem', maxWidth: '80px', margin: '0 auto' }}>
                          {person.name.split(' ')[0]}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-muted p-4 text-center bg-light rounded-3">
                  {t('registration.noPeopleRegistered')}
                </div>
              )}
            </Col>

            {/* WHERE & WHEN */}
            <Col lg={4} className="ps-lg-4 mt-4 mt-lg-0">
               <div className="d-flex flex-column gap-4">
                  <div>
                    <Form.Label className="small fw-bold text-muted uppercase">{t('registration.selectLocation')}</Form.Label>
                    <Form.Select 
                      className="bg-light border-0 p-3" 
                      style={{ borderRadius: '10px' }}
                      value={locationId}
                      onChange={(e) => setLocationId(e.target.value)}
                    >
                      {locationsList.map(loc => (
                         <option key={loc.id} value={loc.id}>{loc.name}</option>
                      ))}
                    </Form.Select>
                    {locationsList.length === 0 && <span className="small text-danger">{t('registration.createVenues')}</span>}
                  </div>

                  <div>
                    <Form.Label className="small fw-bold text-muted uppercase">{t('registration.startTime')}</Form.Label>
                    {isManualMode ? (
                      <div className="d-flex flex-column gap-2 mb-2">
                        <Form.Control 
                          type="datetime-local" 
                          className="bg-light border-0 p-3 shadow-none" 
                          style={{ borderRadius: '10px' }}
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                        />
                        
                        <Form.Label className="small fw-bold text-muted uppercase mt-2">{t('registration.endTime')}</Form.Label>
                        <Form.Control 
                          type="datetime-local" 
                          className="bg-light border-0 p-3 shadow-none border-start border-4 border-warning" 
                          style={{ borderRadius: '10px' }}
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                        />
                        <span className="text-muted small">Preencha apenas se a pessoa já encerrou o turno.</span>
                      </div>
                    ) : (
                       <div className="bg-light border-0 p-3 text-muted rounded-3 d-flex align-items-center">
                         <CheckCircle className="text-success me-2" />
                         {t('registration.useNow')}
                       </div>
                    )}
                    
                    <div className="mt-3 d-flex gap-2">
                       <Badge 
                        bg={!isManualMode ? 'primary' : 'light'} 
                        className={`cursor-pointer px-4 py-2 text-${!isManualMode ? 'white' : 'dark'} border`}
                        style={{ cursor: 'pointer', fontSize: '0.8rem' }}
                        onClick={setModeNow}
                       >
                         {t('registration.useNow')}
                       </Badge>
                       <Badge 
                        bg={isManualMode ? 'primary' : 'light'} 
                        className={`cursor-pointer px-4 py-2 text-${isManualMode ? 'white' : 'dark'} border`}
                        style={{ cursor: 'pointer', fontSize: '0.8rem' }}
                        onClick={setModeManual}
                       >
                         {t('registration.manual')}
                       </Badge>
                    </div>
                  </div>

                  <div className="mt-2">
                    <button 
                      className="tea-button-primary w-100 py-3 d-flex flex-column align-items-center justify-content-center" 
                      disabled={selectedPeople.length === 0 || locationsList.length === 0}
                      onClick={handleStartTracking}
                      style={{ borderRadius: '12px' }}
                    >
                      <span className="fw-bold" style={{ fontSize: '1rem' }}>{t('registration.startTracking', { count: selectedPeople.length })}</span>
                      {isManualMode && endTime && <span className="small text-white-50">{t('registration.autoClockOut')}</span>}
                    </button>
                  </div>
               </div>
            </Col>
          </Row>
        </div>
      </div>

    </div>
  );
};

export default Registration;