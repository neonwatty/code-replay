const inputArea = document.getElementById("inputArea");
const outputArea = document.getElementById("outputArea");
const logArea = document.getElementById("log");
const startButton = document.getElementById("record-start");
const stopButton = document.getElementById("record-stop");
const clearButton = document.getElementById("record-clear");
const timer = document.getElementById("timer");

// timer
let counter = 0;
let interval;

function stopTimer() {
  clearInterval(interval);
}

function convertSec(cnt) {
  let sec = cnt % 60;
  let min = Math.floor(cnt / 60);
  if (sec < 10) {
    if (min < 10) {
      return "0" + min + ":0" + sec;
    } else {
      return min + ":0" + sec;
    }
  } else if (min < 10 && sec >= 10) {
    return "0" + min + ":" + sec;
  } else {
    return min + ":" + sec;
  }
}

function startTimer() {
  interval = setInterval(function () {
    timer.innerHTML = convertSec(counter++); // timer start counting here...
  }, 1000);
}

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
  startTimer();

  // start recorder
  startRecorder();
});

// stop recording
stopButton.addEventListener("click", () => {
  // stop timer
  stopTimer();

  // stop keydown event listener
  inputArea.removeEventListener("keydown", recorder);
});

// clear recording
clearButton.addEventListener("click", () => {
  // clear out keystrokes
  keystrokes = [];

  // clear out input html
  inputArea.value = "";

  // reset timer
  timer.innerHTML = "00:00";
});

export { keystrokes };
