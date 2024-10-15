import { outputEditor } from "./codemirror.js";
import { loadKeystrokes } from "./local.js";
import { setScanner } from "./scanner.js";
import Timer from "./timer.js";

const replayTimer = document.getElementById("replay-timer");
const timer = new Timer(replayTimer);

const startBtn = document.getElementById("replay-start");
const stopBtn = document.getElementById("replay-stop");

let replay_counter = 0;
let keystrokes = [];
let currentIndex = 0;
let isPaused = false;
let replayTimeout;
let startTime;

function playKeyPress(key, currentIndex) {
  if (currentIndex >= 0) {
    switch (key) {
      case "Enter":
        outputEditor.replaceRange("\n\t", outputEditor.getCursor()); // Add a new line
        break;

      case " ":
        outputEditor.replaceRange(" ", outputEditor.getCursor()); // Add a space
        break;

      case "Tab":
        outputEditor.replaceRange("\t", outputEditor.getCursor()); // Add a tab
        break;

      case "Backspace":
        const cursor = outputEditor.getCursor();
        const currentLine = outputEditor.getLine(cursor.line);
        if (cursor.ch > 0) {
          outputEditor.replaceRange(
            "",
            { line: cursor.line, ch: cursor.ch - 1 },
            cursor
          ); // Remove last character
        } else if (cursor.line > 0) {
          const previousLineLength = outputEditor.getLine(
            cursor.line - 1
          ).length;
          outputEditor.setCursor({
            line: cursor.line - 1,
            ch: previousLineLength,
          }); // Move cursor up to the end of previous line
          outputEditor.replaceRange(
            "",
            { line: cursor.line - 1, ch: previousLineLength - 1 },
            cursor
          ); // Remove last character of previous line
        }
        break;
      default:
        outputEditor.replaceRange(key, outputEditor.getCursor()); // Append the key normally
        break;
    }
  }
}

function replayKeystrokes() {
  if (currentIndex >= keystrokes.length) {
    // stop all
    pauseReplay();
    return;
  }

  const keystroke = keystrokes[currentIndex];
  const keyTime = keystroke.timestamp;
  const delay = new Date(keyTime) - new Date(startTime);

  // update scanner position
  setScanner(keystroke);

  replayTimeout = setTimeout(() => {
    if (!isPaused) {
      // Check if it's paused
      playKeyPress(keystroke.key, currentIndex);
      currentIndex++; // Move to the next keystroke
      startTime = keyTime;
      replayKeystrokes(); // Call the function recursively to schedule the next keystroke
    } else {
      // If paused, just wait and check again
      replayKeystrokes(); // Re-schedule the current index to check when to proceed
    }
  }, delay);
}

// Function to pause the replay
function pauseReplay() {
  // set pause flag
  isPaused = true;

  // clear replay timeout
  clearTimeout(replayTimeout); // Clear the timeout

  // stop timer
  timer.stop();
}

function startReplay() {
  // set pause to false
  isPaused = false;

  // only load keystrokes on first click of play btn
  if (replay_counter === 0) {
    keystrokes = loadKeystrokes();
    startTime = keystrokes[0].timestamp;
    replay_counter += 1;
  }

  // start keystrokes
  replayKeystrokes();

  // start timer
  timer.start();
}

startBtn.addEventListener("click", startReplay);
stopBtn.addEventListener("click", pauseReplay);

export { playKeyPress };
