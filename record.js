const inputArea = document.getElementById("inputArea");
const logArea = document.getElementById("log");

// Array to store keystrokes
let keystrokes = [];

// Event listener for keydown events
inputArea.addEventListener("keydown", (event) => {
  const timestamp = new Date().toISOString();
  const keyDescription = event.key;

  if (
    keyDescription === "Shift" ||
    keyDescription === "Alt" ||
    keyDescription === "Control" ||
    keyDescription === "Meta"
  ) {
    return; // Skip recording
  }

  // Log the keystroke
  keystrokes.push({ keyDescription, timestamp });

  // Update the log display
  logArea.innerHTML = `<p>Key: ${keyDescription}, Time: ${timestamp}</p>`;
});

export { keystrokes };
