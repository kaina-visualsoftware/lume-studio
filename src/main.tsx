import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const style = document.createElement('style');
style.textContent = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { 
    font-family: 'Inter', sans-serif; 
    background: #09090B; 
    -webkit-font-smoothing: antialiased;
    color: #FAFAFA;
  }
  #root { min-height: 100vh; }
  input { font-family: inherit; }
  button { font-family: inherit; }
`;
document.head.appendChild(style);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);