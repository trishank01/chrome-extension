import React from 'react';

function App() {
  
  return (
    <div style={{ padding: 20, width: 250 }}>
      <h2>My Chrome Extension</h2>
      <button onClick={() =>  navigator.clipboard.writeText('Copy this text to clipboard')}>Copy Highlight text</button>
    </div>
  );
}

export default App;
