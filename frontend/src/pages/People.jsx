import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Row, Col, Modal, Form, Button, Table } from 'react-bootstrap';
import { 
  PersonAdd, 
  Camera,
  PencilSquare,
  Trash
} from 'react-bootstrap-icons';
import axios from 'axios';
import '../App.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
const API_URL = `${API_BASE}/people/`;

const People = () => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [people, setPeople] = useState([]);
  
  // States for Edit / Add Modes
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    position: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    fetchPeople();
  }, []);

  const fetchPeople = async () => {
    try {
      const response = await axios.get(API_URL);
      
      const today = new Date();
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
      const lastDay = today.toISOString().split('T')[0];
      const reportRes = await axios.get(`${API_BASE}/logs/report/?start_date=${firstDay}&end_date=${lastDay}`);
      
      const breakdown = reportRes.data.breakdown || [];
      
      const enrichedPeople = response.data.map(person => {
         const stats = breakdown.find(b => b.id === person.id) || { horas: 0, locais: 0 };
         return {
           ...person,
           total_hours: stats.horas,
           total_locations: stats.locais
         };
      });

      setPeople(enrichedPeople);
    } catch (error) {
      console.error("Erro ao carregar pessoas:", error);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setIsEditMode(false);
    setCurrentId(null);
    setFormData({ name: '', position: '', email: '', phone: '' });
  };

  const handleShowAdd = () => {
    setIsEditMode(false);
    setCurrentId(null);
    setFormData({ name: '', position: '', email: '', phone: '' });
    setShowModal(true);
  };

  const handleShowEdit = (person) => {
    setIsEditMode(true);
    setCurrentId(person.id);
    setFormData({
      name: person.name,
      position: person.position || '',
      email: person.email || '',
      phone: person.phone || ''
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
      fetchPeople();
    } catch (error) {
      console.error("Erro ao salvar pessoa:", error);
      alert("Houve um erro ao salvar. Verifique se os dados estão corretos.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Atenção! Deseja excluir permanentemente este colaborador e todos os seus registros?")) {
      try {
        await axios.delete(`${API_URL}${currentId}/`);
        handleClose();
        fetchPeople();
      } catch (error) {
        console.error("Erro ao excluir pessoa:", error);
        alert("Não foi possível excluir. O sistema pode estar impedindo devido a vínculos importantes.");
      }
    }
  };

  return (
    <div className="pessoas-container px-4 py-3">
      
      {/* 🚀 HEADER SECTION */}
      <div className="card-premium p-3 mb-4 d-flex justify-content-between align-items-center bg-light border shadow-sm rounded-3">
        <h2 className="fw-bold mb-0" style={{ fontSize: '1.5rem', color: 'var(--text-h)' }}>{t('people.title')}</h2>
        <button className="tea-button-primary d-flex align-items-center gap-2" onClick={handleShowAdd} style={{ padding: '8px 20px', borderRadius: '8px' }}>
          <PersonAdd size={20} /> {t('people.addNew')}
        </button>
      </div>

      {/* 📊 TABLE SECTION */}
      <div className="card-premium bg-white border shadow-sm rounded-3 overflow-hidden">
        <Table hover responsive className="mb-0 align-middle">
          <thead className="bg-light">
            <tr style={{ borderBottom: '2px solid #eee' }}>
              <th className="px-4 py-3 text-muted" style={{ width: '25%', fontWeight: '600' }}>{t('people.collaborator')}</th>
              <th className="py-3 text-muted" style={{ width: '35%', fontWeight: '600' }}>{t('people.recentLocations')}</th>
              <th className="py-3 text-muted text-center" style={{ width: '25%', fontWeight: '600' }}>{t('people.totalHours')}</th>
              <th className="py-3 text-muted text-center" style={{ width: '15%', fontWeight: '600' }}>{t('people.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {people.length > 0 ? people.map((person) => (
              <tr key={person.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                <td className="px-4 py-3">
                  <div className="d-flex align-items-center gap-3">
                    <img 
                      src={person.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=6366f1&color=fff`} 
                      alt={person.name} 
                      className="rounded-circle shadow-sm"
                      style={{ width: '48px', height: '48px', objectFit: 'cover' }} 
                    />
                    <div>
                      <div className="fw-bold" style={{ color: 'var(--text-h)', fontSize: '1.05rem' }}>{person.name}</div>
                      <div className="text-muted small">{person.position}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3">
                  <div className="d-flex flex-wrap gap-2">
                    <span className="badge bg-light text-muted border px-2 py-1" style={{ fontWeight: '500', fontSize: '0.85rem', borderRadius: '4px' }}>
                      {person.total_locations || 0} {t('reports.locationsWorked')}
                    </span>
                  </div>
                </td>
                <td className="py-3 text-center">
                  <div style={{ fontWeight: '700', fontSize: '1.4rem', color: person.total_hours > 0 ? '#10b981' : '#ccc' }}>
                    {(person.total_hours || 0).toFixed(1)}h
                  </div>
                </td>
                <td className="py-3 text-center">
                    <PencilSquare 
                      className="text-secondary cursor-pointer hover-text-primary" 
                      size={20} 
                      style={{ cursor: 'pointer', transition: 'color 0.2s' }} 
                      onClick={() => handleShowEdit(person)} 
                    />
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" className="text-center py-5 text-muted">
                  {t('people.noPeople')}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* ➕ ADD/EDIT PERSON MODAL */}
      <Modal show={showModal} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title style={{ fontWeight: '700' }}>
            {isEditMode ? t('people.modalEditTitle') : t('people.modalAddTitle')}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form>
            <Row>
              <Col md={12} className="text-center mb-4">
                <div className="mx-auto bg-light rounded-circle d-flex align-items-center justify-content-center shadow-inner" style={{ width: '100px', height: '100px', cursor: 'pointer', border: '2px dashed var(--border)' }}>
                  <div className="text-muted small">
                    <Camera size={24} /><br />Foto
                  </div>
                </div>
              </Col>
              
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">{t('people.fullName')}</Form.Label>
                  <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Ex: Carlos Pinto" className="p-2" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">{t('people.position')}</Form.Label>
                  <Form.Control type="text" name="position" value={formData.position} onChange={handleInputChange} placeholder="Ex: Engenheiro Civil" className="p-2" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">{t('people.email')}</Form.Label>
                  <Form.Control type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="carlos.pinto@tea.com" className="p-2" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold">{t('people.phone')}</Form.Label>
                  <Form.Control type="text" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="(11) 98888-1234" className="p-2" />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0 pb-4 px-4 d-flex justify-content-between">
          <div>
             {isEditMode && (
               <Button variant="outline-danger" onClick={handleDelete} className="fw-bold px-3 d-flex align-items-center gap-2">
                 <Trash size={16} /> {t('people.delete')}
               </Button>
             )}
          </div>
          <div>
            <Button variant="light" onClick={handleClose} className="fw-bold px-4 me-2">{t('people.cancel')}</Button>
            <button className="tea-button-primary px-4 py-2" onClick={handleSubmit} style={{ borderRadius: '8px' }}>
              {isEditMode ? t('people.update') : t('people.save')}
            </button>
          </div>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default People;