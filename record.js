const inputArea = document.getElementById("inputArea");
const outputArea = document.getElementById("outputArea");
const logArea = document.getElementById("log");
const startButton = document.getElementById("record-start");
const stopButton = document.getElementById("record-stop");
const clearButton = document.getElementById("record-clear");

// Array to store keystrokes
let keystrokes = [];

// recorder function
function recorder(event) {
  // unpack data
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

  // package key data
  const keyData = { keyDescription, timestamp };

  // Log the keystroke
  keystrokes.push(keyData);

  // Update the log display
  logArea.innerHTML = `<p>Key: ${keyDescription}, Time: ${timestamp}</p>`;
}

// Event listener for keydown events
function startRecorder() {
  inputArea.addEventListener("keydown", (event) => {
    recorder(event);
  });
}

// start recording
startButton.addEventListener("click", () => {
  // clear input / output area
  inputArea.value = "";
  outputArea.value = "";

  // clear keystrokes
  keystrokes = [];

  // start recorder
  startRecorder();
});

// stop recording
stopButton.addEventListener("click", () => {
  inputArea.removeEventListener("keydown", recorder);
});

// clear recording
clearButton.addEventListener("click", () => {
  // clear out keystrokes
  keystrokes = [];

  // clear out input html
  inputArea.value = "";
});

export { keystrokes };
