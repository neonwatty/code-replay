import { outputEditor } from "./codemirror.js";
import {
  keystrokes,
  playDuration,
  recordingComplete,
  startRecordTime,
} from "./record.js";
import { playKeyPress } from "./replay.js";
import { saveScannerPointer } from "./storage.js";

// record buttons
const startButton = document.getElementById("record-start");
const stopButton = document.getElementById("record-stop");

// scanner elements
const replayScanner = document.getElementById("replay-scanner");
const scannerPointer = document.getElementById("scanner-pointer");
const scannerBar = document.getElementById("scanner-bar");

// scanner variables
let scannerWidth = 0;
let scannerPosition = 0;

// set actual scanner width after page load
window.addEventListener("load", () => {
  // get bounding x values from scanner box
  const widthEndOffset = 12;
  scannerWidth = scannerBar.offsetWidth - widthEndOffset;
  console.log();
});

startButton.removeEventListener("click", () => {
  stopButton.removeEventListener("click", setScannerPointer);
});
stopButton.addEventListener("click", setScannerPointer);

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
function setScannerFromPlay() {
  // update actual time of scanner
  newX = inputVideo.currentTime;
  saveScannerPointer("start_slider_video", newX);

  // update visual scanner
  const scannerNormalizedNewX = inverseScannerWidthDurationMapper(newX);
  saveScannerPointer("start_slider_actual", scannerNormalizedNewX);
  scannerPointer.style.left = Math.ceil(scannerNormalizedNewX) + "px";
}

function setScannerPointer() {
  console.log("setting scanner pointer");

  let pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  scannerPointer.onmousedown = dragMouseDown;
  function dragMouseDown(e) {
    e = e || window.e;
    e.preventDefault();

    // Get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;

    // Call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.e;
    e.preventDefault();

    // Calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;

    // Set the element's new position:
    let newX = scannerPointer.offsetLeft - pos1;
    if (newX / scannerWidth > 1) {
      newX = scannerWidth;
    } else if (newX < 0) {
      newX = 0;
    }

    // update slider visually
    scannerPointer.style.left = newX + "px";

    // save slider actual (visual on element) value
    saveScannerPointer("scanner_pointer_normalized", newX);

    // convert to record time and save
    const scannerPosition = scannerWidthDurationMapper(newX);
    saveScannerPointer("scanner_pointer_actual", scannerPosition);

    // show all keystrokes up to widthNormalizedNewX
    const currentKeystrokes = keystrokes.filter((keystroke) => {
      // Convert timestamp to float
      const timestamp =
        new Date(keystroke.timestamp).getTime() - startRecordTime;

      // Return true if the timestamp is less than the threshold
      return timestamp < scannerPosition;
    });

    // reset output editor
    outputEditor.setValue("");

    // display keys
    currentKeystrokes.forEach((element, index) => {
      playKeyPress(element.key, index);
    });
  }

  function closeDragElement() {
    // Stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
