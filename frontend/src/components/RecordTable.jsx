import React from 'react';
import { Table, Button, InputGroup, Form, Card, Pagination } from 'react-bootstrap';
import { Search, PlusLg } from 'react-bootstrap-icons';

const RecordTable = () => {
  return (
    <Card className="border-0 shadow-sm">
      <Card.Body className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <InputGroup className="w-50">
            <InputGroup.Text className="bg-white border-end-0">
              <Search size={18} />
            </InputGroup.Text>
            <Form.Control 
              placeholder="Pesquisar registros..." 
              className="border-start-0"
            />
          </InputGroup>
          <Button variant="primary" className="d-flex align-items-center gap-2">
            <PlusLg /> Novo Registro
          </Button>
        </div>

        <Table responsive hover className="align-middle">
          <thead className="bg-light">
            <tr>
              <th>ID</th>
              <th>Nome do Registro</th>
              <th>Status</th>
              <th>Data de Criação</th>
              <th className="text-end">Ações</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4].map(id => (
              <tr key={id}>
                <td>#{id}024</td>
                <td className="fw-bold">Registro de Atividade {id}</td>
                <td><span className="badge bg-success bg-opacity-10 text-success px-3 py-2">Ativo</span></td>
                <td>2{id}/03/2024</td>
                <td className="text-end">
                  <Button variant="link" className="p-0 text-muted me-3 text-decoration-none">Editar</Button>
                  <Button variant="link" className="p-0 text-danger text-decoration-none">Excluir</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Pagination className="justify-content-end mt-4">
          <Pagination.Prev />
          <Pagination.Item active>{1}</Pagination.Item>
          <Pagination.Item>{2}</Pagination.Item>
          <Pagination.Next />
        </Pagination>
      </Card.Body>
    </Card>
  );
};

export default RecordTable;