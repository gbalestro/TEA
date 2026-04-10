import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Row, Col, Modal, Form, Button, Table } from 'react-bootstrap';
import { 
  PersonLock, 
  ShieldCheck,
  PencilSquare,
  Trash,
  KeyFill
} from 'react-bootstrap-icons';
import axios from 'axios';
import '../App.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
const API_URL = `${API_BASE}/users/`;

const Users = () => {
    const { t } = useTranslation();
    const [showModal, setShowModal] = useState(false);
    const [users, setUsers] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'staff'
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(API_URL);
            setUsers(response.data);
        } catch (error) {
            console.error("Error loading users:", error);
        }
    };

    const handleClose = () => {
        setShowModal(false);
        setIsEditMode(false);
        setCurrentId(null);
        setFormData({ username: '', email: '', password: '', role: 'staff' });
    };

    const handleShowAdd = () => {
        setIsEditMode(false);
        setFormData({ username: '', email: '', password: '', role: 'staff' });
        setShowModal(true);
    };

    const handleShowEdit = (user) => {
        setIsEditMode(true);
        setCurrentId(user.id);
        setFormData({
            username: user.username,
            email: user.email || '',
            role: user.role || 'staff',
            password: '' // Don't show old password
        });
        setShowModal(true);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            // If editing and password is empty, don't send it
            const submissionData = { ...formData };
            if (isEditMode && !submissionData.password) {
                delete submissionData.password;
            }

            if (isEditMode) {
                await axios.put(`${API_URL}${currentId}/`, submissionData);
            } else {
                await axios.post(API_URL, submissionData);
            }
            handleClose();
            fetchUsers();
        } catch (error) {
            console.error("Error saving user:", error);
            alert(t('users.errorSave'));
        }
    };

    const handleDelete = async () => {
        if (window.confirm(t('users.confirmDelete'))) {
            try {
                await axios.delete(`${API_URL}${currentId}/`);
                handleClose();
                fetchUsers();
            } catch (error) {
                console.error("Error deleting user:", error);
            }
        }
    };

    const getRoleLabel = (role) => {
        switch(role) {
            case 'admin': return t('users.adminRole');
            case 'manager': return t('users.managerRole');
            default: return t('users.staffRole');
        }
    };

    return (
        <div className="users-container px-4 py-3">
            {/* 🚀 HEADER */}
            <div className="card-premium p-3 mb-4 d-flex justify-content-between align-items-center bg-light border shadow-sm rounded-3 people-header">
                <div>
                    <h2 className="fw-bold mb-0" style={{ fontSize: '1.5rem', color: 'var(--text-h)' }}>{t('users.title')}</h2>
                    <p className="text-muted small mb-0">{t('users.subtitle')}</p>
                </div>
                <button className="tea-button-primary d-flex align-items-center gap-2" onClick={handleShowAdd} style={{ padding: '8px 20px', borderRadius: '8px' }}>
                    <PersonLock size={20} /> {t('users.addNew')}
                </button>
            </div>

            {/* 📊 LIST */}
            <div className="card-premium bg-white border shadow-sm rounded-3 overflow-hidden">
                <Table hover responsive className="mb-0 align-middle">
                    <thead className="bg-light d-none d-md-table-header-group">
                        <tr style={{ borderBottom: '2px solid #eee' }}>
                            <th className="px-4 py-3 text-muted">{t('users.username')}</th>
                            <th className="py-3 text-muted">{t('users.role')}</th>
                            <th className="py-3 text-muted text-center">{t('users.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id} className="responsive-table-row">
                                <td className="px-md-4 py-3">
                                    <div className="fw-bold">{u.username}</div>
                                    <div className="text-muted small">{u.email || t('users.noEmail')}</div>
                                </td>
                                <td className="py-3">
                                    <span className={`badge px-3 py-2 rounded-pill ${
                                        u.role === 'admin' ? 'bg-primary bg-opacity-10 text-primary' : 
                                        u.role === 'manager' ? 'bg-success bg-opacity-10 text-success' : 
                                        'bg-secondary bg-opacity-10 text-secondary'
                                    }`} style={{ fontWeight: '600' }}>
                                        {getRoleLabel(u.role)}
                                    </span>
                                </td>
                                <td className="py-3 text-md-center">
                                    <Button variant="light" size="sm" className="border shadow-sm p-2" onClick={() => handleShowEdit(u)}>
                                        <PencilSquare className="text-primary" size={18} />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            {/* ➕ MODAL */}
            <Modal show={showModal} onHide={handleClose} centered>
                <Modal.Header closeButton className="border-0">
                    <Modal.Title className="fw-bold">{isEditMode ? t('users.modalEditTitle') : t('users.modalAddTitle')}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold text-muted">{t('users.username')}</Form.Label>
                            <Form.Control type="text" name="username" value={formData.username} onChange={handleInputChange} className="p-2 bg-light border-0" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold text-muted">{t('users.emailLabel')}</Form.Label>
                            <Form.Control 
                                type="email" 
                                name="email" 
                                value={formData.email} 
                                onChange={handleInputChange} 
                                className="p-2 bg-light border-0" 
                                placeholder={t('users.emailPlaceholder')}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold text-muted">{t('users.role')}</Form.Label>
                            <Form.Select name="role" value={formData.role} onChange={handleInputChange} className="p-2 bg-light border-0">
                                <option value="staff">{t('users.staffRole')}</option>
                                <option value="manager">{t('users.managerRole')}</option>
                                <option value="admin">{t('users.adminRole')}</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold text-muted">{t('users.passwordLabel')}</Form.Label>
                            <div className="input-group">
                                <span className="input-group-text bg-light border-0"><KeyFill /></span>
                                <Form.Control 
                                    type="password" 
                                    name="password" 
                                    value={formData.password} 
                                    onChange={handleInputChange} 
                                    className="p-2 bg-light border-0" 
                                    placeholder={isEditMode ? t('users.keepPasswordPlaceholder') : t('users.passwordPlaceholder')}
                                />
                            </div>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="border-0 d-flex justify-content-center gap-2 pb-4">
                    {isEditMode && (
                        <Button variant="outline-danger" onClick={handleDelete} className="me-auto fw-bold">
                            <Trash size={18} /> {t('users.delete')}
                        </Button>
                    )}
                    <Button variant="light" onClick={handleClose} className="fw-bold px-4">{t('users.cancel')}</Button>
                    <button className="tea-button-primary px-4 py-2" onClick={handleSubmit}>
                        {t('users.save')}
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Users;
