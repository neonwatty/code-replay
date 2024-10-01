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

// clear out keystroke storage
clearKeystrokes();

// Array to store keystrokes
let keystrokes = loadKeystrokes();

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

  // Log the keystroke
  addKeystroke(keystrokes, keyDescription, timestamp);

  // Update the log display
  logArea.innerHTML = `<p>Key: ${keyDescription}, Time: ${timestamp}</p>`;

  // FOR TESTING - load in full keystroke history from local storage and print all //
  let all_keystrokes = loadKeystrokes();
  console.log(`all keystrokes --> ${all_keystrokes}`);
}

// Event listener for keydown events
function startRecorder() {
  // start recorder
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

  // start timer
  timer.start();

  // start recorder
  startRecorder();
});

// stop recording
stopButton.addEventListener("click", () => {
  // stop timer
  timer.stop();

  // stop keydown event listener
  inputArea.removeEventListener("keydown", recorder);
});

// clear recording
clearButton.addEventListener("click", () => {
  // clear out keystrokes
  keystrokes = clearKeystrokes();

  // clear out input and output
  inputArea.value = "";
  outputArea.innerHTML = "";

  // clear timer
  timer.clear();
});

export { keystrokes };
