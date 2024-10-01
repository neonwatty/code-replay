import { addKeystroke, clearKeystrokes, loadKeystrokes } from "./local.js";
import Timer from "./timer.js";
const inputArea = document.getElementById("inputArea");
const outputArea = document.getElementById("outputArea");
const logArea = document.getElementById("log");
const startButton = document.getElementById("record-start");
const stopButton = document.getElementById("record-stop");
const clearButton = document.getElementById("record-clear");
const recordTimer = document.getElementById("record-timer");
const timer = new Timer(recordTimer);
let prevInputLength = 1; // 1 added for pre-start symbol
let curInputLength = 0;

// clear out keystroke storage
clearKeystrokes();

// Array to store keystrokes
let keystrokes = loadKeystrokes();

// function to keep current input value length up to date
function updateInputLength(e) {
  curInputLength = e.target.value.length + 1;
}

// recorder function
function recorder(event) {
  // check if keypress has changed input area value length
  if (curInputLength != prevInputLength) {
    // unpack data
    const timestamp = new Date().toISOString();
    let keyDescription = event.key;
    if (
      keyDescription === "Shift" ||
      keyDescription === "Alt" ||
      keyDescription === "Control" ||
      keyDescription === "Meta"
    ) {
      return; // Skip recording
    }

    // Log the keystroke
    addKeystroke(keystrokes, keyDescription, timestamp);

    // Update the log display
    logArea.innerHTML = `<p>Key: ${keyDescription}, Time: ${timestamp}</p>`;
  }
  prevInputLength = curInputLength;
}

// Event listener for keydown events
function startRecorder() {
  // create start symbol
  const timestamp = new Date().toISOString();
  addKeystroke(keystrokes, "a", timestamp);

  // start recorder
  inputArea.addEventListener("keydown", (event) => {
    recorder(event);
  });

  inputArea.addEventListener("input", (event) => {
    updateInputLength(event);
  });
}

// start recording
startButton.addEventListener("click", () => {
  // clear input / output area
  inputArea.value = "";
  outputArea.value = "";

  // clear keystrokes
  keystrokes = [];

  // start timer
  timer.start();

  // start recorder
  startRecorder();
});

// stop recording
stopButton.addEventListener("click", () => {
  // stop timer
  timer.stop();

  // stop keydown and input event listener
  inputArea.removeEventListener("keydown", recorder);
  inputArea.removeEventListener("input", updateInputLength);

  // create stop symbol
  const timestamp = new Date().toISOString();
  addKeystroke(keystrokes, "a", timestamp);
});

// clear recording
clearButton.addEventListener("click", () => {
  // clear out keystrokes
  keystrokes = clearKeystrokes();

  // clear out input and output
  inputArea.value = "";
  outputArea.innerHTML = "";
  logArea.innerHTML = "";

  // clear timer
  timer.clear();
});

export { keystrokes };
