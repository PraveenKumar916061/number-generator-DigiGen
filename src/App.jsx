import { useState } from 'react'
import digigenLogo from './assets/digigen.svg'
import viteLogo from '/vite.svg'
import './App.css'


function App() {
  const initialNumbers = Array.from({ length: 90 }, (_, i) => i + 1);
  const [numbers, setNumbers] = useState(initialNumbers);
  const [generated, setGenerated] = useState([]);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleGenerate = () => {
    if (numbers.length === 0) return;
    const randomIndex = Math.floor(Math.random() * numbers.length);
    const num = numbers[randomIndex];
    setGenerated([...generated, num]);
    setNumbers(numbers.filter((n) => n !== num));
    setHistory([...history, num]);
    // Voice announcement
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
      const speak = () => {
        const utter = new window.SpeechSynthesisUtterance(`Number ${num}`);
        utter.lang = 'en-IN';
        utter.rate = 0.9;
        utter.pitch = 1.1;
        utter.volume = 1;
        const voices = window.speechSynthesis.getVoices();
        const preferred = voices.find(v =>
          (v.lang === 'en-IN') ||
          (v.lang === 'en_US' && v.name.toLowerCase().includes('india')) ||
          (v.name.toLowerCase().includes('indian'))
        );
        if (preferred) utter.voice = preferred;
        window.speechSynthesis.speak(utter);
      };
      // If voices are not loaded, wait for them
      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = () => setTimeout(speak, 100);
      } else {
        setTimeout(speak, 100); // Short delay to ensure voice is ready
      }
    }
  };

  const handleReset = () => {
    setNumbers(initialNumbers);
    setGenerated([]);
    setHistory([]);
    setShowHistory(false);
  };

  return (
    <div>
      {/* <h1>DigiGen</h1> */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <img src={digigenLogo} alt="DigiGen Logo" style={{ width: '48px', height: '48px' }} />
        <h1 style={{ margin: 0, fontSize: '4.5rem', color: '#3498db', fontWeight: '900', letterSpacing: '3px' }}>DigiGen</h1>
      </div>
      {/* <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#333' }}>Number Generator (1-90)</h2> */}
      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={handleGenerate}
          disabled={numbers.length === 0}
          style={{
            background: '#3498db',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '1rem',
            cursor: numbers.length === 0 ? 'not-allowed' : 'pointer',
            opacity: numbers.length === 0 ? 0.6 : 1,
            marginRight: '1rem',
            boxShadow: '0 2px 6px rgba(52,152,219,0.15)',
            transition: 'background 0.2s',
          }}
        >
          Generate
        </button>
        <button
          onClick={() => setShowHistory((h) => !h)}
          style={{
            background: showHistory ? '#e67e22' : '#2ecc71',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '1rem',
            cursor: 'pointer',
            marginRight: '1rem',
            boxShadow: '0 2px 6px rgba(46,204,113,0.15)',
            transition: 'background 0.2s',
          }}
        >
          {showHistory ? 'Hide History' : 'Show History'}
        </button>
        <button
          onClick={handleReset}
          style={{
            background: '#e74c3c',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(231,76,60,0.15)',
            transition: 'background 0.2s',
          }}
        >
          Reset
        </button>
      </div>

      {/* Only show history block if toggled, else show generated number and grid */}
      {showHistory ? (
        <div style={{
          margin: '0 auto',
          maxWidth: '500px',
          background: '#f4f4f4',
          borderRadius: '10px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          padding: '1rem',
          marginBottom: '2rem',
        }}>
          <h3 style={{ textAlign: 'center', color: '#333', margin: '0 0 1rem 0' }}>History</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
            {history.map((num) => (
              <span key={num} style={{ color: '#e74c3c', fontWeight: 'bold', fontSize: '1.1rem' }}>{num}</span>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Show last generated number */}
          {generated.length > 0 && (
            <div style={{
              margin: '0 auto 1rem auto',
              maxWidth: '200px',
              background: '#fffbe6',
              borderRadius: '10px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              padding: '1rem',
              textAlign: 'center',
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#e67e22',
            }}>
              {generated[generated.length - 1]}
            </div>
          )}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(10, 1fr)',
            gap: '8px',
            marginBottom: '2rem',
            justifyItems: 'center',
          }}>
            {initialNumbers.map((num) => {
              const isGenerated = generated.includes(num);
              return (
                <div
                  key={num}
                  className={isGenerated ? 'number-red' : 'number-green'}
                  style={{
                    width: '48px',
                    height: '48px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    boxSizing: 'border-box',
                    transition: 'background 0.3s',
                  }}
                >
                  {num}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default App
