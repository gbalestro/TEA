import React from 'react';
import { Card, Form, Row, Col, Button, Nav, ProgressBar } from 'react-bootstrap';

const ProjectStepperForm = () => {
  return (
    <Card className="border-0 shadow-sm">
      <Card.Header className="bg-white py-3">
        <h5 className="mb-0">Novo Projeto TEA</h5>
      </Card.Header>
      <Card.Body className="p-4">
        {/* Stepper Header */}
        <Nav variant="pills" className="justify-content-center mb-4 gap-4 fw-bold">
          <Nav.Item>
            <Nav.Link active className="rounded-pill px-4">1. Informações</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link disabled className="rounded-pill px-4">2. Responsáveis</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link disabled className="rounded-pill px-4">3. Orçamento</Nav.Link>
          </Nav.Item>
        </Nav>
        
        <ProgressBar now={33} className="mb-5" style={{ height: '10px' }} label="33%" />

        {/* Form Section */}
        <Form>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="projName">
              <Form.Label className="text-muted">Nome do Projeto</Form.Label>
              <Form.Control type="text" placeholder="Ex: Expansão TEA 2024" />
            </Form.Group>
          </Row>
          <Row className="mb-4">
            <Form.Group as={Col} controlId="projDesc">
              <Form.Label className="text-muted">Descrição Geral</Form.Label>
              <Form.Control as="textarea" rows={3} placeholder="Descreva os objetivos do projeto..." />
            </Form.Group>
          </Row>
          
          <div className="d-flex justify-content-end gap-2">
            <Button variant="outline-secondary">Cancelar</Button>
            <Button variant="primary" className="px-4">Próximo Passo</Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default ProjectStepperForm;