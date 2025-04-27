import React, { useState, useEffect } from 'react';

export default function Highlights() {
  const [highlights, setHighlights] = useState([]);

  // 1) Load persisted highlights on mount
  useEffect(() => {
    chrome.storage.local.get('copiedHighlights', ({ copiedHighlights = [] }) => {
      if (Array.isArray(copiedHighlights)) {
        setHighlights(copiedHighlights);
      }
    });
  }, []);

  // 2) Handler to delete one highlight by its reversed index
  const handleDelete = (revIndex) => {
    // Convert reversed index back to original-array index
    const actualIndex = highlights.length - 1 - revIndex;
    const newHighlights = highlights.filter((_, i) => i !== actualIndex);

    // Update React state
    setHighlights(newHighlights);
    // Persist change in storage
    chrome.storage.local.set({ copiedHighlights: newHighlights });
  };

  // 3) Render most-recent-first
  const displayed = [...highlights].reverse();

  return (
    <div style={{ padding: 20, width: 300 }}>
      <h3>Highlight History</h3>
      {displayed.length === 0 ? (
        <p>No highlights saved yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, maxHeight: 240, overflowY: 'auto' }}>
          {displayed.map((h, idx) => (
            <li
              key={idx}
              style={{
                marginBottom: 12,
                borderBottom: '1px solid #eee',
                paddingBottom: 4
              }}
            >
              <div style={{ fontSize: 14 }}>{h.text}</div>
              <div style={{ fontSize: 10, color: '#666' }}>
                {new Date(h.copiedAt).toLocaleString()} — <i>{h.domain}</i>
              </div>
              <button
                onClick={() => handleDelete(idx)}
                style={{ marginTop: 6, fontSize: 12 }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
