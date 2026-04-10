import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Row, Col, Modal, Form, Button, Table } from 'react-bootstrap';
import { 
  GeoAlt, 
  Plus,
  PencilSquare,
  Trash
} from 'react-bootstrap-icons';
import axios from 'axios';
import '../App.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
const API_URL = `${API_BASE}/locations/`;

const Venues = () => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [locais, setLocais] = useState([]);
  
  // Edit mode states
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    address: ''
  });

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await axios.get(API_URL);
      
      const today = new Date();
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
      const lastDay = today.toISOString().split('T')[0];
      const reportRes = await axios.get(`${API_BASE}/logs/report/?start_date=${firstDay}&end_date=${lastDay}`);
      
      const rawLogs = reportRes.data.raw_logs || [];
      
      const enrichedLocais = response.data.map(local => {
         const localLogs = rawLogs.filter(log => log.location_id === local.id);
         
         const uniquePeople = new Set(localLogs.map(l => l.person_id));
         
         let totalHoursLocal = 0;
         localLogs.forEach(log => {
             if(log.clock_in && log.clock_out) {
                const inTime = new Date(log.clock_in).getTime();
                const outTime = new Date(log.clock_out).getTime();
                totalHoursLocal += (outTime - inTime) / (1000 * 60 * 60);
             }
         });
         
         return {
           ...local,
           team_size: uniquePeople.size,
           total_hours: totalHoursLocal
         };
      });

      setLocais(enrichedLocais);
    } catch (error) {
      console.error("Erro ao carregar locais:", error);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setIsEditMode(false);
    setCurrentId(null);
    setFormData({ name: '', address: '' });
  };

  const handleShowAdd = () => {
    setIsEditMode(false);
    setCurrentId(null);
    setFormData({ name: '', address: '' });
    setShowModal(true);
  };
  
  const handleShowEdit = (local) => {
    setIsEditMode(true);
    setCurrentId(local.id);
    setFormData({
      name: local.name,
      address: local.address || ''
    });
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      if (isEditMode) {
        await axios.put(`${API_URL}${currentId}/`, formData);
      } else {
        await axios.post(API_URL, formData);
      }
      handleClose();
      fetchLocations();
    } catch (error) {
      console.error("Erro ao salvar local:", error);
      alert("Houve um erro ao salvar o local.");
    }
  };

  const handleDelete = async () => {
    if(window.confirm("Deseja realmente excluir este local e todos os seus registros de atividades permanentemente?")) {
      try {
        await axios.delete(`${API_URL}${currentId}/`);
        handleClose();
        fetchLocations();
      } catch (error) {
        console.error("Erro ao deletar local:", error);
        alert("Erro ao excluir local.");
      }
    }
  };

  return (
    <div className="locais-container px-4 py-3">
      
      {/* 🚀 HEADER SECTION */}
      <div className="card-premium p-3 mb-4 d-flex justify-content-between align-items-center bg-light border shadow-sm rounded-3 people-header">
        <h2 className="fw-bold mb-0" style={{ fontSize: '1.5rem', color: 'var(--text-h)' }}>{t('venues.title')}</h2>
        <button className="tea-button-primary d-flex align-items-center gap-2" onClick={handleShowAdd} style={{ padding: '8px 20px', borderRadius: '8px' }}>
          <Plus size={24} /> {t('venues.addNew')}
        </button>
      </div>

      {/* 📊 TABLE SECTION */}
      <div className="card-premium bg-white border shadow-sm rounded-3 overflow-hidden">
        <Table borderless hover responsive className="mb-0 align-middle">
          <thead className="bg-light d-none d-md-table-header-group">
            <tr style={{ borderBottom: '2px solid #eee' }}>
              <th className="px-5 py-3 text-md-center" style={{ width: '30%', fontWeight: '600' }}>{t('venues.venueName')}</th>
              <th className="py-3 text-md-center" style={{ width: '30%', fontWeight: '600' }}>{t('venues.recentTeam')}</th>
              <th className="py-3 text-md-center" style={{ width: '25%', fontWeight: '600' }}>{t('venues.totalHours')}</th>
              <th className="py-3 text-md-center" style={{ width: '15%', fontWeight: '600' }}>{t('venues.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {locais.length > 0 ? locais.map((local) => (
              <tr key={local.id} className="responsive-table-row">
                <td className="px-md-5 py-3 cell-collaborator">
                  <div className="fw-bold" style={{ fontSize: '1.2rem', color: 'var(--text-h)' }}>{local.name}</div>
                  <div className="text-muted small">{local.address}</div>
                </td>
                <td className="py-3 cell-locations">
                  <div className="d-flex justify-content-md-center">
                    <span className="badge bg-light text-muted border px-3 py-2" style={{ fontWeight: '500', fontSize: '0.85rem', borderRadius: '6px' }}>
                      {local.team_size || 0} {t('sidebar.people').toLowerCase()}
                    </span>
                  </div>
                </td>
                <td className="py-3 text-md-center cell-hours">
                  <div className="hours-value" style={{ fontWeight: '700', fontSize: '1.45rem', color: local.total_hours > 0 ? '#3b82f6' : '#ccc' }}>
                    {(local.total_hours || 0).toFixed(1)}h
                  </div>
                </td>
                <td className="py-3 text-md-center cell-actions">
                    <Button variant="light" size="sm" className="border shadow-sm p-2 d-flex align-items-center justify-content-center" onClick={() => handleShowEdit(local)}>
                      <PencilSquare className="text-primary" size={18} />
                    </Button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" className="text-center py-5 text-muted">
                  {t('venues.noVenues')}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* ➕ ADD/EDIT LOCAL MODAL */}
      <Modal show={showModal} onHide={handleClose} centered size="md">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title style={{ fontWeight: '700' }}>
            {isEditMode ? t('venues.modalEditTitle') : t('venues.modalAddTitle')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-muted">{t('venues.venueName').toUpperCase()} *</Form.Label>
              <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} className="p-2 border-0 bg-light" style={{ borderRadius: '8px' }} />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label className="small fw-bold text-muted">{t('venues.address').toUpperCase()}</Form.Label>
              <Form.Control type="text" name="address" value={formData.address} onChange={handleInputChange} className="p-2 border-0 bg-light" style={{ borderRadius: '8px' }} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0 pb-4 px-4 d-flex justify-content-center gap-2">
          {isEditMode && (
            <Button variant="outline-danger" onClick={handleDelete} className="fw-bold px-3 d-flex align-items-center gap-2 me-auto">
              <Trash size={16} /> {t('venues.delete')}
            </Button>
          )}
          <Button variant="light" onClick={handleClose} className="fw-bold px-4">{t('venues.cancel')}</Button>
          <button className="tea-button-primary px-4 py-2" onClick={handleSubmit} style={{ borderRadius: '8px' }}>
            {isEditMode ? t('venues.update') : t('venues.save')}
          </button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default Venues;