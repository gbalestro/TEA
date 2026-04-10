import React, { useState } from 'react';
import { Form, Button, Card, Container, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShieldLockFill, PersonFill, LockFill, InfoCircle } from 'react-bootstrap-icons';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        const result = await login(username, password);
        
        if (result.success) {
            navigate('/people'); // Default landing after login
        } else {
            setError(result.message);
        }
        setIsSubmitting(false);
    };

    return (
        <div className="login-page-wrapper d-flex align-items-center justify-content-center" style={{ 
            minHeight: '100vh', 
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            padding: '20px'
        }}>
            <Container style={{ maxWidth: '450px' }}>
                <Card className="border-0 shadow-lg rounded-4 overflow-hidden" style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)' }}>
                    <Card.Body className="p-5">
                        <div className="text-center mb-5">
                            <div className="d-inline-flex p-3 rounded-circle bg-primary bg-opacity-10 mb-3 text-primary">
                                <ShieldLockFill size={40} />
                            </div>
                            <h2 className="fw-bold" style={{ color: '#1e293b' }}>TEA System</h2>
                            <p className="text-muted">Faça login para gerenciar sua equipe</p>
                        </div>

                        {error && <Alert variant="danger" className="py-2 small border-0 mb-4">{error}</Alert>}

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-4" controlId="username">
                                <Form.Label className="small fw-bold text-muted text-uppercase letter-spacing-1">Username</Form.Label>
                                <div className="input-group">
                                    <span className="input-group-text bg-white border-end-0 text-muted">
                                        <PersonFill />
                                    </span>
                                    <Form.Control 
                                        type="text" 
                                        placeholder="Seu usuário" 
                                        className="border-start-0 py-2"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        style={{ outline: 'none', boxShadow: 'none' }}
                                    />
                                </div>
                            </Form.Group>

                            <Form.Group className="mb-5" controlId="password">
                                <Form.Label className="small fw-bold text-muted text-uppercase letter-spacing-1">Password</Form.Label>
                                <div className="input-group">
                                    <span className="input-group-text bg-white border-end-0 text-muted">
                                        <LockFill />
                                    </span>
                                    <Form.Control 
                                        type="password" 
                                        placeholder="Sua senha" 
                                        className="border-start-0 py-2"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        style={{ outline: 'none', boxShadow: 'none' }}
                                    />
                                </div>
                            </Form.Group>

                            <Button 
                                variant="primary" 
                                type="submit" 
                                className="w-100 py-3 rounded-3 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
                                disabled={isSubmitting}
                                style={{ background: '#6366f1', border: 'none' }}
                            >
                                {isSubmitting ? <Spinner animation="border" size="sm" /> : 'Entrar no Sistema'}
                            </Button>
                        </Form>

                        <div className="text-center mt-5">
                            <p className="small text-muted mb-2">TEA System &copy; 2026</p>
                            <Button 
                                variant="link" 
                                size="sm" 
                                className="text-decoration-none text-muted opacity-75 hover-opacity-100" 
                                onClick={() => navigate('/about')}
                            >
                                <InfoCircle className="me-1" /> Sobre o Projeto
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};

export default Login;
