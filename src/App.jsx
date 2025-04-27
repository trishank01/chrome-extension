// Highlights.js (or any component name you prefer)

import React, { useEffect, useState } from 'react';

const App = () => {
  const [highlights, setHighlights] = useState([]);

  // Fetch the saved highlights from chrome storage on component mount
  useEffect(() => {
    chrome.storage.local.get('copiedHighlights', (result) => {
      if (result.copiedHighlights) {
        setHighlights(result.copiedHighlights.reverse());
      }
    });
  }, []); // Empty dependency array ensures this runs only once when component mounts

  return (
    <div>
      <h2>Saved Highlights</h2>
      {highlights.length > 0 ? (
        <ul>
          {highlights.map((highlight, index) => (
            <li key={index}>
              <strong>{highlight.text}</strong>
              <br />
              <small>Copied at: {highlight.copiedAt}</small>
              <br />
              <small>Domain: {highlight.domain}</small>
            </li>
          ))}
        </ul>
      ) : (
        <p>No highlights saved yet.</p>
      )}
    </div>
  );
};

export default App;
