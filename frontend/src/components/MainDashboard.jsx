import React from 'react';
import { Container, Row, Col, Card, Stack } from 'react-bootstrap';
import { Person, GraphUp, ListTask, Bag } from 'react-bootstrap-icons';

const MainDashboard = () => {
  const stats = [
    { title: 'Lucro Total', val: 'R$ 45.000', icon: <Bag color="green"/> },
    { title: 'Usuários Ativos', val: '1.250', icon: <Person color="blue"/> },
    { title: 'Projetos Concluídos', val: '48', icon: <ListTask color="orange"/> },
    { title: 'Crescimento', val: '+12%', icon: <GraphUp color="purple"/> }
  ];

  return (
    <Container fluid className="p-0">
      <Row className="mb-4">
        {stats.map((item, idx) => (
          <Col key={idx} sm={6} lg={3} className="mb-3">
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <Stack direction="horizontal" className="justify-content-between align-items-center">
                  <div>
                    <div className="text-muted small">{item.title}</div>
                    <h3 className="fw-bold mb-0">{item.val}</h3>
                  </div>
                  <div className="fs-1">{item.icon}</div>
                </Stack>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Card className="border-0 shadow-sm p-4">
        <h5>Atividade Recente</h5>
        <p className="text-muted">Painel de métricas carregado com sucesso conforme o layout solicitado.</p>
      </Card>
    </Container>
  );
};

export default MainDashboard;