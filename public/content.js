let popup = null;
let savedText = ''; // Store selected text

document.addEventListener('mouseup', (event) => {
  const selection = window.getSelection();
  const selected = selection.toString().trim();

  if (popup && popup.contains(event.target)) {
    return;
  }

  if (selected.length > 0) {
    savedText = selected; // Save the selected text 
    showPopup(event.pageX, event.pageY);
  } else {
    removePopup();
  }
});

function showPopup(x, y) {
  removePopup(); // Clean previous popup

  popup = document.createElement('div');
  popup.innerText = 'Copy highlight?';
  popup.style.position = 'absolute';
  popup.style.top = `${y + 10}px`;
  popup.style.left = `${x + 10}px`;
  popup.style.padding = '8px 12px';
  popup.style.background = 'white';
  popup.style.border = '1px solid #ccc';
  popup.style.borderRadius = '6px';
  popup.style.cursor = 'pointer';
  popup.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
  popup.style.zIndex = 10000;
  popup.style.userSelect = 'none';
  popup.style.transition = 'opacity 0.3s'; 

  popup.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (savedText.length > 0) {
      navigator.clipboard.writeText(savedText)
        .then(() => {
          popup.innerText = 'Copied!';
          setTimeout(() => {
            removePopup();
          }, 800);
        })
        .catch(err => {
          console.error('Failed to copy:', err);
        });
    }
  });

  document.body.appendChild(popup);
}

function removePopup() {
  if (popup) {
    popup.remove();
    popup = null;
  }
}
