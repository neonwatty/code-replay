import { outputEditor } from "./codemirror.js";
import { loadKeystrokes } from "./local.js";
import { playDuration, startRecordTime } from "./record.js";
import { updateVisual } from "./replay-timer-visual.js";
import Timer from "./replay-timer.js";
import { scannerTimestamp, setScanner } from "./scanner.js";

const replayTimer = document.getElementById("replay-timer");
const timer = new Timer();

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
    // update keypress
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

  // update timer
  updateVisual(
    replayTimer,
    Math.ceil((new Date(keystroke.timestamp).getTime() - startRecordTime) / 100)
  );

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

  // reset play counter
  replay_counter = 0;
}

function startReplay() {
  // reset flags
  isPaused = false;
  currentIndex = 0;

  // only load keystrokes on first click of play btn
  if (replay_counter === 0) {
    // load keystrokes from memory
    keystrokes = loadKeystrokes();

    // show all keystrokes up to widthNormalizedNewX
    keystrokes = keystrokes.filter((keystroke) => {
      // Convert timestamp to float
      const timestamp =
        new Date(keystroke.timestamp).getTime() - startRecordTime;

      // Return true if the timestamp is less than the threshold
      return timestamp >= scannerTimestamp;
    });
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
