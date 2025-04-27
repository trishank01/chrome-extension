// DEBUG: confirm injection
console.log("▶️ Highlight Copier content.js loaded on", window.location.href);

let popup = null;
let savedText = "";

// 1) Detect user selection
document.addEventListener("mouseup", (event) => {
  const sel = window.getSelection().toString().trim();

  // If we clicked our own popup, ignore
  if (popup && popup.contains(event.target)) {
    return;
  }

  if (sel) {
    savedText = sel;
    showPopup(event.pageX, event.pageY);
  } else {
    removePopup();
  }
});

// 2) Create and show the floating popup
function showPopup(x, y) {
  removePopup();

  popup = document.createElement("div");
  popup.innerText = "Copy highlight?";
  Object.assign(popup.style, {
    position: "absolute",
    top: `${y + 10}px`,
    left: `${x + 10}px`,
    padding: "8px 12px",
    background: "white",
    border: "1px solid #ccc",
    borderRadius: "6px",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
    zIndex: 10000,
    userSelect: "none"
  });

  // 3) On click: copy & persist
  popup.addEventListener("click", (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!savedText) return;

    navigator.clipboard.writeText(savedText)
      .then(() => {
        // load existing highlights or []
        chrome.storage.local.get(
          { copiedHighlights: [] },
          ({ copiedHighlights }) => {
            console.log("[content.js] before save:", copiedHighlights);

            const history = Array.isArray(copiedHighlights)
              ? copiedHighlights
              : [];

            // add new entry
            history.push({
              text: savedText,
              copiedAt: new Date().toISOString(),
              domain: window.location.hostname
            });

            // save back
            chrome.storage.local.set({ copiedHighlights: history }, () => {
              console.log("[content.js] after save:", history);
              popup.innerText = "Copied!";
              setTimeout(removePopup, 800);
            });
          }
        );
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
      });
  });

  document.body.appendChild(popup);
}

// 4) Remove the popup if no selection or after copy
function removePopup() {
  if (popup) {
    popup.remove();
    popup = null;
  }
}

// 5) Also hide it if user clicks anywhere else
document.addEventListener("mousedown", (e) => {
  if (popup && !popup.contains(e.target)) {
    removePopup();
  }
});
