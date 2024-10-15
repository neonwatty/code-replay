import { inputEditor, outputEditor } from "./codemirror.js";
import { addKeystroke, clearKeystrokes, loadKeystrokes } from "./local.js";
import Timer from "./record-timer.js";
const logArea = document.getElementById("log");
const startButton = document.getElementById("record-start");
const stopButton = document.getElementById("record-stop");
const clearButton = document.getElementById("record-clear");
const recordTimer = document.getElementById("record-timer");
const timer = new Timer(recordTimer);
let playDuration;
let startRecordTime;
let stopRecordTime;
let recordingComplete = false;

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
  // filter out non-recordable key strokes
  let keyDescription = event.key;
  if (
    keyDescription === "Shift" ||
    keyDescription === "Alt" ||
    keyDescription === "Control" ||
    keyDescription === "Meta"
  ) {
    return; // Skip recording
  }

  // unpack data
  const timestamp = new Date().toISOString();

  // Log the keystroke
  addKeystroke(keystrokes, keyDescription, timestamp);

  // Update the log display
  logArea.innerHTML = `<p>Key: ${keyDescription}, Time: ${timestamp}</p>`;
}

// Event listener for keydown events
function startRecorder() {
  // create start symbol
  const timestamp = new Date().toISOString();

  // start recorder
  inputEditor.on("keydown", (editor, event) => {
    recorder(event);
  });

  inputEditor.on("input", (editor, event) => {
    updateInputLength(event);
  });
}

// start recording
startButton.addEventListener("click", () => {
  // clear input / output area
  inputEditor.setValue("");
  outputEditor.setValue("");

  // clear keystrokes
  keystrokes = [];

  // start timer
  timer.start();

  // record start time
  startRecordTime = Date.now();

  // start recorder
  startRecorder();
});

// stop recording
stopButton.addEventListener("click", () => {
  // stop timer
  timer.stop();

  // update stop
  stopRecordTime = Date.now();

  // update recording flag
  recordingComplete = true;

  // create stop symbol
  // const timestamp = new Date().toISOString();
  // addKeystroke(keystrokes, "a", timestamp);

  // update recordingComplete flag
  recordingComplete = true;

  // update playDuration
  if (keystrokes.length > 0) {
    playDuration = stopRecordTime - startRecordTime;
  }
});

// clear recording
clearButton.addEventListener("click", () => {
  // clear out keystrokes
  keystrokes = clearKeystrokes();

  // clear out input and output
  inputEditor.setValue("");
  outputEditor.setValue("");
  logArea.innerHTML = "";

  // clear timer
  timer.clear();

  // reset recording flag
  recordingComplete = false;
});

export {
  keystrokes,
  playDuration,
  recordingComplete,
  startRecordTime,
  stopRecordTime,
};
