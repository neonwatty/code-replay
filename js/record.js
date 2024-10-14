import { inputEditor, outputEditor } from "./codemirror.js";
import { addKeystroke, clearKeystrokes, loadKeystrokes } from "./local.js";
import Timer from "./timer.js";
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

  // start recorder
  startRecorder();
});

// stop recording
stopButton.addEventListener("click", () => {
  // stop timer
  timer.stop();

  // stop keydown and input event listener
  inputEditor.removeEventListener("keydown", recorder);
  inputEditor.removeEventListener("input", updateInputLength);

  // create stop symbol
  const timestamp = new Date().toISOString();
  addKeystroke(keystrokes, "a", timestamp);
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
});

export { keystrokes };
