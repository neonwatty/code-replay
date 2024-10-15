import { playDuration, recordingComplete } from "./record.js";

// record buttons
const startButton = document.getElementById("record-start");
const stopButton = document.getElementById("record-stop");

// scanner elements
const replayScanner = document.getElementById("replay-scanner");
const trimStartDrag = document.getElementById("trim-start-drag");
const scannerBar = document.getElementById("scanner-bar");

// scanner variables
let scannerWidth = 0;

// set scanner width
function setScannerWidth() {
  // get bounding x values from scanner box
  const widthEndOffset = 12;
  scannerWidth = replayScanner.offsetWidth - widthEndOffset;
}
startButton.removeEventListener("click", () => {
  stopButton.removeEventListener("click", setScannerWidth);
});
stopButton.addEventListener("click", setScannerWidth);

// mappers
// map playDuration to scanner box width
function inverseScannerWidthDurationMapper(t) {
  const normalizedVal = (t / playDuration) * scannerWidth;
  return normalizedVal;
}

// map scanner box width to playDuration
function scannerWidthDurationMapper(t) {
  const normalizedVal = (t / scannerWidth) * playDuration;
  return normalizedVal;
}

// stopped here
// visual scanner update
function setScanner() {
  // update actual time of scanner
  const newX = inputVideo.currentTime;
  saveSlider("start_slider_video", newX);

  // update visual scanner
  const scannerNormalizedNewX = inverseScannerWidthDurationMapper(newX);
  saveSlider("start_slider_actual", scannerNormalizedNewX);
  trimStartDrag.style.left = Math.ceil(scannerNormalizedNewX) + "px";
}
