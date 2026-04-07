import React from 'react';
import { useTranslation } from 'react-i18next';

const UnderConstruction = ({ titulo }) => {
  const { t, i18n } = useTranslation();
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
      <p>{i18n.language.startsWith('pt') ? 'Estamos trabalhando nisso! Em breve você poderá gerenciar tudo por aqui.' : 'We are working on this! Soon you will be able to manage everything here.'}</p>
      
      {/* Um botão fake só para compor o visual */}
      <button className="btn btn-outline-secondary btn-sm" disabled>
        {i18n.language.startsWith('pt') ? 'Voltar ao Painel' : 'Back to Dashboard'}
      </button>
    </div>
  );
};

export default UnderConstruction;