import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import teaImage from './assets/logoTEA_PNG.png'
import teaImageSmall from './assets/logoTEA_small.png'
import './App.css'

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
          <div>
            <h1>TEA</h1>
            <h2>Track Everything App</h2>  
            <p>
              by Gui Balestro, Gui Silveira & Cesar Garcia
              <nav>
                with Coffee & tea
              </nav>
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
        <div className='centerDiv' id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Read about our project</p>
          <ul>
            <li>
              <a href="https://github.com/gbalestro/TEA/blob/main/README.md" target="_blank">
                <img className="logo" src={teaImageSmall} alt="" />
                Readme
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the community</p>
          <ul>
            <li>
              <a href="https://github.com/gbalestro/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                Gui Balestro
              </a>
            </li>
            <li>
              <a href="https://github.com/silveiraguilherme" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                Gui Silveira
              </a>
            </li>
            <li>
              <a href="https://github.com/Cesargarciajr/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                Cesar Garcia
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
