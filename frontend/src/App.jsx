import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Nav, Stack } from 'react-bootstrap';
import { 
  Speedometer2, 
  ClipboardData, 
  People, 
  GeoAlt, 
  BarChart, 
  CupHot, 
  Gear, 
  PersonCircle,
  LayoutTextWindow
} from 'react-bootstrap-icons';
import './App.css';

import Home from './pages/Home';
import Registro from './pages/Registro';
import Tea from './pages/Tea';
import Pessoas from './pages/Pessoas';
import Locais from './pages/Locais';
import Relatorios from './pages/Relatorios';
import Test from './pages/Test';

function App() {
    // Esse hook nos dá o objeto location, que contém o "pathname" (ex: /registro)
    const location = useLocation();

    // Função para formatar o nome da página baseado na rota
    const getPageTitle = (path) => {
      switch (path) {
        case '/': return 'Home';
        case '/registro': return 'Registro';
        case '/tea': return 'Project';
        case '/pessoas': return 'Pessoas';
        case '/locais': return 'Locais';
        case '/relatorios': return 'Relatórios';
        default: return 'Dashboard';
      }
    };

  return (
      <div className="app-container">
        
        {/* A: SIDEBAR */}
        <aside className="sidebar bg-dark text-white shadow">
          <div className="sidebar-logo d-flex align-items-center p-4" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            <CupHot className="me-2 text-primary" /> TEA
          </div>
          <hr className="mx-3 opacity-25" />
          <Nav className="flex-column px-3 gap-1">
            <Nav.Link as={Link} to="/" className={`text-white d-flex align-items-center p-2 ${location.pathname === '/' ? 'bg-primary rounded' : ''}`}>
              <Speedometer2 className="me-2" /> Dashboard
            </Nav.Link>
            <Nav.Link as={Link} to="/test" className={`text-white d-flex align-items-center p-2 ${location.pathname === '/test' ? 'bg-primary rounded' : ''}`}>
              <LayoutTextWindow className="me-2" /> Test
            </Nav.Link>
            <Nav.Link as={Link} to="/registro" className={`text-white d-flex align-items-center p-2 ${location.pathname === '/registro' ? 'bg-primary rounded' : ''}`}>
              <ClipboardData className="me-2" /> Registro
            </Nav.Link>
            <Nav.Link as={Link} to="/pessoas" className={`text-white d-flex align-items-center p-2 ${location.pathname === '/pessoas' ? 'bg-primary rounded' : ''}`}>
              <People className="me-2" /> Pessoas
            </Nav.Link>
            <Nav.Link as={Link} to="/locais" className={`text-white d-flex align-items-center p-2 ${location.pathname === '/locais' ? 'bg-primary rounded' : ''}`}>
              <GeoAlt className="me-2" /> Locais
            </Nav.Link>
            <Nav.Link as={Link} to="/relatorios" className={`text-white d-flex align-items-center p-2 ${location.pathname === '/relatorios' ? 'bg-primary rounded' : ''}`}>
              <BarChart className="me-2" /> Relatórios
            </Nav.Link>
            <Nav.Link as={Link} to="/tea" className={`text-white d-flex align-items-center p-2 ${location.pathname === '/tea' ? 'bg-primary rounded' : ''}`}>
              <CupHot className="me-2" /> TEA Project
            </Nav.Link>
          </Nav>
          
          <div className="mt-auto p-3">
            <hr className="opacity-25" />
            <Stack gap={2}>
              <div className="d-flex align-items-center p-2 opacity-75 small"><PersonCircle className="me-2" /> Administrador</div>
              <div className="d-flex align-items-center p-2 opacity-75 small" style={{cursor: 'pointer'}}><Gear className="me-2" /> Configurações</div>
            </Stack>
          </div>
        </aside>

        {/* B & C: AREA DA DIREITA */}
        <main className="main-content">
          
          {/* B: ACTIVE HEADER (Opcional, pode ficar dentro das páginas) */}
          <div className="bg-white border-bottom shadow-sm px-4 py-3">
             <span className="text-muted">TEA</span> / <strong className="text-primary">{getPageTitle(location.pathname)}</strong>
          </div>

          {/* C: CONTEÚDO DINÂMICO */}
          <div style={{ padding: '20px' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/test" element={<Test />} />
              <Route path="/registro" element={<Registro />} />
              <Route path="/tea" element={<Tea />} />
              <Route path="/pessoas" element={<Pessoas />} />
              <Route path="/locais" element={<Locais />} />
              <Route path="/relatorios" element={<Relatorios />} />
            </Routes>
          </div>
          
        </main>
      </div>
  );
}

export default App;