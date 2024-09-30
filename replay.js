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

    console.log(delay);
    console.log(keystroke);
    console.log(delay);

    setTimeout(() => {
      outputArea.innerHTML += keystroke.keyDescription;
      // Set the caret position to the end
      outputArea.focus();
    }, delay);
    startTime = keyTime;
  });
}

replayBtn.addEventListener("click", () => {
  replayKeystrokes(keystrokes);
});
