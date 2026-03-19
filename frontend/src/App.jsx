import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import './App.css'; // Importe o CSS acima

import Home from './pages/Home';
import Registro from './pages/Registro';
import Tea from './pages/Tea';
import Pessoas from './pages/Pessoas';
import Locais from './pages/Locais';
import Relatorios from './pages/Relatorios';

import { useLocation } from 'react-router-dom';

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
        <aside className="sidebar">
          <div className="sidebar-logo" style={{ padding: '10px', fontSize: '1.5rem', fontWeight: 'bold' }}>
            ☕ TEA
          </div>
          <hr />
          <Nav className="flex-column">
            <Nav.Link as={Link} to="/tea" className="mb-2">☕ TEA Project</Nav.Link>
            <Nav.Link as={Link} to="/registro" className="mb-2">📋 Registro</Nav.Link>
            <Nav.Link as={Link} to="/pessoas" className="mb-2">👥 Pessoas</Nav.Link>
            <Nav.Link as={Link} to="/locais" className="mb-2">📍 Locais</Nav.Link>
            <Nav.Link as={Link} to="/relatorios" className="mb-2">📊 Relatórios</Nav.Link>
          </Nav>
          
          {/* Espaçador para empurrar o perfil para baixo */}
          <div style={{ marginTop: 'auto' }}>
            <hr />
            <div style={{ padding: '10px' }}>User Profile</div>
            <div style={{ padding: '10px' }}>Settings</div>
          </div>
        </aside>

        {/* B & C: AREA DA DIREITA */}
        <main className="main-content">
          
          {/* B: ACTIVE HEADER (Opcional, pode ficar dentro das páginas) */}
          <div style={{ padding: '15px', borderBottom: '1px solid #eee', background: '#fff' }}>
             <strong>TEA / {getPageTitle(location.pathname)}</strong>
          </div>

          {/* C: CONTEÚDO DINÂMICO */}
          <div style={{ padding: '20px' }}>
            <Routes>
              <Route path="/" element={<Home />} />
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