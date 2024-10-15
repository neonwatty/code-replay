import { outputEditor } from "./codemirror.js";
import {
  keystrokes,
  playDuration,
  recordingComplete,
  startRecordTime,
  stopRecordTime,
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
let scannerTimestamp;

function setScanner(keystroke) {
  if (recordingComplete) {
    // create scanner timestamp
    scannerTimestamp =
      new Date(keystroke.timestamp).getTime() - startRecordTime;

    // convert timestamp to position
    scannerPosition = normalizeScannerPosition(
      scannerTimestampToPosition(scannerTimestamp)
    );

    // update actual time of scanner
    saveScannerPointer("scanner_pointer_position", scannerPosition);
    saveScannerPointer("scanner_pointer_timestamp", scannerTimestamp);

    // update visual position
    scannerPointer.style.left = scannerPosition + "px";
  }
}

// set actual scanner width after page load
window.addEventListener("load", () => {
  // get bounding x values from scanner box
  const widthEndOffset = 12;
  scannerWidth = scannerBar.offsetWidth - widthEndOffset;
});

startButton.removeEventListener("click", () => {
  stopButton.removeEventListener("click", () => {
    // add hash marks based on key presses to bar

    // setup slider
    setScannerPointer();
  });
});
stopButton.addEventListener("click", setScannerPointer);

// mappers
function scannerTimestampToPosition(t) {
  const normalizedVal = (t / playDuration) * scannerWidth;
  return normalizedVal;
}

function scannerPositionToTimestamp(t) {
  const normalizedVal = (t / scannerWidth) * playDuration;
  return normalizedVal;
}

function normalizeScannerPosition(p) {
  // map scannerTimestamp to scannerPosition
  if (p / scannerWidth > 1) {
    p = scannerWidth;
  } else if (p < 0) {
    p = 0;
  }
  return p;
}

function setScannerPointer() {
  if (recordingComplete) {
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
      scannerPosition = normalizeScannerPosition(
        scannerPointer.offsetLeft - pos1
      );

      // update slider visually
      scannerPointer.style.left = scannerPosition + "px";

      // save slider actual (visual on element) value
      saveScannerPointer("scanner_pointer_position", scannerPosition);

      // convert to record time and save
      scannerTimestamp = scannerPositionToTimestamp(scannerPosition);
      saveScannerPointer("scanner_pointer_timestamp", scannerTimestamp);

      // show all keystrokes up to widthNormalizedNewX
      const currentKeystrokes = keystrokes.filter((keystroke) => {
        // Convert timestamp to float
        const timestamp =
          new Date(keystroke.timestamp).getTime() - startRecordTime;

        // Return true if the timestamp is less than the threshold
        return timestamp < scannerTimestamp;
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
}

export { scannerPosition, scannerTimestamp, setScanner };
