import React from 'react';

const EmConstrucao = ({ titulo }) => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '60vh', // Ocupa boa parte da área de conteúdo
      color: '#6c757d',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '4rem', marginBottom: '10px' }}>🚧</div>
      <h2 style={{ fontWeight: '300' }}>{titulo}</h2>
      <p>Estamos trabalhando nisso! Em breve você poderá gerenciar tudo por aqui.</p>
      
      {/* Um botão fake só para compor o visual */}
      <button className="btn btn-outline-secondary btn-sm" disabled>
        Voltar ao Painel
      </button>
    </div>
  );
};

export default EmConstrucao;