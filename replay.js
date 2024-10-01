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
  console.log(`key printed --> ${key}`);
  outputArea.innerHTML += key;
}

function replayKeystrokes() {
  if (currentIndex >= keystrokes.length) return; // Stop if all keystrokes have been processed

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

  console.log(`replay_counter --> ${replay_counter}`);

  // start keystrokes
  replayKeystrokes();

  // start timer
  timer.start();
}

startBtn.addEventListener("click", startReplay);
stopBtn.addEventListener("click", pauseReplay);
