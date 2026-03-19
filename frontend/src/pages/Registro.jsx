import React, { useState, useEffect } from 'react';

const RegistroPonto = () => {
  const [hora, setHora] = useState(new Date().toLocaleTimeString());

  // Atualiza o relógio a cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setHora(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <div className="card shadow-sm" style={{ borderRadius: '15px', border: '1px solid #eee' }}>
        <div className="card-body text-center" style={{ padding: '40px' }}>
          <h5 className="text-muted mb-4">REGISTRO DE PONTO</h5>
          
          {/* Relógio em Tempo Real */}
          <div style={{ fontSize: '3.5rem', fontWeight: 'bold', color: '#2c3e50', marginBottom: '10px' }}>
            {hora}
          </div>
          <p className="text-secondary mb-5">{new Date().toLocaleDateString()}</p>

          <div className="d-flex justify-content-center gap-3">
            <button className="btn btn-success btn-lg" style={{ width: '150px' }} disabled>
              Clock-in
            </button>
            <button className="btn btn-danger btn-lg" style={{ width: '150px' }} disabled>
              Clock-out
            </button>
          </div>

          <div style={{ marginTop: '40px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '10px', border: '1px solid #ffeeba' }}>
            <small style={{ color: '#856404' }}>
              <strong>🚧 Módulo em Desenvolvimento:</strong><br />
              A integração com o banco de dados (Django) para salvar os horários está sendo configurada.
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistroPonto;