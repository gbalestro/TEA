import { useState } from 'react'
import TEAlogo from './assets/logoTEA_small.png'
import './App.css'

function App() {
  // 1. O estado (lógica) fica aqui, antes do 'return'
  const [likes, setLikes] = useState(0)
  const [isLiked, setIsLiked] = useState(false)

  const toggleLike = () => {
    if (isLiked) {
      setLikes(likes - 1)
    } else {
      setLikes(likes + 1)
    }
    setIsLiked(!isLiked)
  }

  return (
    <>
      <div>
        <a href="https://github.com/gbalestro/TEA" target="_blank">
          <img src={TEAlogo} alt="TEA Logo" />
        </a>
      </div>
      <h1>Starting Our Project</h1>
      <h1>"TEA"</h1>
      <h2>Tracking Everything App</h2>
      <h2>Visit our <a href='https://github.com/gbalestro/TEA'>github page</a> to learn more about it</h2>
  
      <div className="card">
        {/* 2. O botão usa as variáveis que definimos acima */}
        <button 
          onClick={toggleLike}
          style={{ 
            backgroundColor: '#242424',
            border: '1px solid #646cff',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1.2rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            padding: '0.6em 1.2em'
          }}
        >
          <span style={{ 
            color: isLiked ? '#ff4040' : '#888', 
            fontSize: '1.5rem',
            filter: isLiked ? 'drop-shadow(0 0 8px #ff4040)' : 'none'
          }}>
            {isLiked ? '❤️' : '🤍'}
          </span>
          <span style={{ color: 'white' }}>
            {likes} {likes === 1 ? 'Like' : 'Likes'}
          </span>
        </button>

        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>

      <p className="read-the-docs">
        Click on the TEA logo to learn more
      </p>
    </>
  )
}

export default App