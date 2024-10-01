import { keystrokes } from "./record.js";

const replayBtn = document.getElementById("replayBtn");
const outputArea = document.getElementById("outputArea");

function replayKeystrokes(keystrokes) {
  // Clear the textarea before replaying
  outputArea.value = "";
  let startTime = keystrokes[0].timestamp;

  keystrokes.forEach((keystroke, index) => {
    const keyTime = keystroke.timestamp;
    const delay = new Date(keyTime) - new Date(startTime);

    setTimeout(() => {
      outputArea.innerHTML += keystroke.keyDescription;
    }, delay);
  });
}

replayBtn.addEventListener("click", () => {
  replayKeystrokes(keystrokes);
});
