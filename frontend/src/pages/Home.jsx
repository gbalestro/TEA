import React from 'react';

function Home() {
  return (
    <div className="p-5 mb-4 bg-light rounded-3 shadow-sm">
      <div className="container-fluid py-5">
        <h1 className="display-5 fw-bold text-primary">Página Inicial</h1>
        <p className="col-md-8 fs-4">Bem-vindo ao sistema de gerenciamento!</p>
        <button className="btn btn-primary btn-lg" type="button">Saiba mais</button>
      </div>
    </div>
  );
}

export default Home;