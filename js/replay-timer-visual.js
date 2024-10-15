function convertSec(cnt) {
  const milliseconds = cnt % 10; // Get the last digit for milliseconds
  const seconds = Math.floor(cnt / 10) % 60; // Get seconds
  const minutes = Math.floor(cnt / 600); // Get total minutes

  return `${minutes < 10 ? "0" : ""}${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}.${milliseconds}`;
}

function updateVisual(timerElement, value) {
  let ha = convertSec(value);
  timerElement.innerHTML = convertSec(value);
}

export { updateVisual };
