import { useState } from 'react'
import teaImage from '../assets/logoTEA_PNG.png'
import teaImageSmall from '../assets/logoTEA_small.png'
import { FcDocument, FcCollaboration} from 'react-icons/fc'; // Para ícones de sistema coloridos
import { BsLinkedin, BsGithub } from 'react-icons/bs';
import '../App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="center">
        <div className="hero">
         <a href="https://github.com/gbalestro/TEA" target="_blank">
          <img src={teaImage} className="base" width="170" height="179" alt="" />
         </a>
        </div>
          <div id='center'>
            <h1 style={{ marginTop:'30px', marginBottom: '-9px' }}>TEA</h1>
            <h2 style={{ marginTop: '-9px' }}>Track Everything App</h2>  
              <p id='textCenter'>
                by Gui Balestro, Gui Silveira & Cesar Garcia<br />
                with ☕ Coffee & Tea 🫖
              </p>
          </div>
        <button
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Like ❤ {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          {/* Trocando o SVG antigo pelo componente moderno */}
          <FcDocument className="icon" aria-hidden="true" />
          
          <h2>Documentation</h2>
          <p style={{marginBottom: '-9px' }}>Read about our project</p>
          <ul>
            <li>
              <a href="https://github.com/gbalestro/TEA/blob/main/README.md" target="_blank"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img className="logo" src={teaImageSmall} alt="" />
                <span>Readme</span>
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          {/* Esse ícone substitui o antigo social-icon */}
          <FcCollaboration className="icon" />
          
          <h2>Connect with me</h2>
          <p>Join the community</p>
          <ul>
            <li>
              <a href="https://github.com/gbalestro/" target="_blank" rel="noopener noreferrer">
                <BsGithub className="button-icon" style={{ color: '#181717' }} /> Github
              </a>
            </li>
            <li>
             <a href="https://www.linkedin.com/in/guilherme-balestro/" target="_blank" rel="noopener noreferrer">
              <BsLinkedin className="button-icon" style={{ color: '#0A66C2' }} /> LinkedIn
            </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
