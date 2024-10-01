import { loadKeystrokes } from "./local.js";
import Timer from "./timer.js";

const replayTimer = document.getElementById("replay-timer");
const timer = new Timer(replayTimer);

const startBtn = document.getElementById("replay-start");
const stopBtn = document.getElementById("replay-stop");
const outputArea = document.getElementById("outputArea");

let replay_counter = 0;
let keystrokes = [];
let currentIndex = 0;
let isPaused = false;
let replayTimeout;
let startTime;

function updateOutput(key) {
  if (currentIndex > 0 && currentIndex < keystrokes.length - 1) {
    switch (key) {
      case "Enter":
        outputArea.innerHTML += "<br>"; // New line for Enter key
        break;
      case " ":
        outputArea.innerHTML += "&nbsp;"; // Add a space for the space key
        break;
      case "Tab":
        outputArea.innerHTML += "&emsp;"; // Optional: Add a tab space
        break;
      case "Backspace":
        // Remove the last character (including any newline or space)
        outputArea.innerHTML = outputArea.innerHTML.slice(0, -1);
        break;
      default:
        outputArea.innerHTML += key; // Append the key normally
        break;
    }
  }
}

function replayKeystrokes() {
  if (currentIndex >= keystrokes.length) {
    timer.stop();
    return;
  }

  const keystroke = keystrokes[currentIndex];
  const keyTime = keystroke.timestamp;
  const delay = new Date(keyTime) - new Date(startTime);

  replayTimeout = setTimeout(() => {
    if (!isPaused) {
      // Check if it's paused
      updateOutput(keystroke.key);
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
  isPaused = true;
  clearTimeout(replayTimeout); // Clear the timeout
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
