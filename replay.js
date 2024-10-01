import { loadKeystrokes } from "./local.js";
import Timer from "./timer.js";

const replayTimer = document.getElementById("replay-timer");
const timer = new Timer(replayTimer);

const startBtn = document.getElementById("replay-start");
const stopBtn = document.getElementById("replay-stop");
const outputArea = document.getElementById("outputArea");

let replay_counter = 0;
let replay_keystrokes = [];
let replayInterval;

function replayKeystrokes(keystrokes) {
  console.log(`REPLAY - replay_keystrokes --> ${keystrokes}`);

  // prevent multiple intervals
  if (replayInterval) return;

  // Clear the textarea before replaying
  outputArea.innerHTML = "";
  let startTime = keystrokes[0].timestamp;
  let key_to_print;

  console.log(`startTime --> ${startTime}`);

  keystrokes.forEach((keystroke, index) => {
    // clear the previous interval
    clearInterval(replayInterval);

    // unpack keystroke timestamp and reconstruct keystroke delay
    const keyTime = keystroke.timestamp;
    const delay = new Date(keyTime) - new Date(startTime);

    console.log(`delay --> ${delay}`);
    console.log(`key to print --> ${keystroke.key}`);

    key_to_print = keystroke.key;

    // simulate keystorke with delay
    setTimeout(() => {
      console.log(`key printed --> ${key_to_print}`);

      outputArea.innerHTML += keystroke.key;
    }, delay);

    // pop off first keystroke
    keystrokes = keystrokes.slice(1);

    // keystrokes after slice
    console.log(`keystrokes after slice --> ${keystrokes}`);
  });
}

function stopReplay() {
  // stop timer and clear interval
  timer.stop();
  clearInterval(replayInterval);
  replayInterval = null;
}

function startReplay() {
  // only load keystrokes on first click of play btn
  if (replay_counter === 0) {
    replay_keystrokes = loadKeystrokes();
    replay_counter += 1;
  }

  console.log(`replay_counter --> ${replay_counter}`);

  // start keystrokes
  replayKeystrokes(replay_keystrokes);

  // start timer
  timer.start();
}

startBtn.addEventListener("click", startReplay);
stopBtn.addEventListener("click", stopReplay);
