// Key to store the keystrokes in Local Storage
const STORAGE_KEY = "keystrokes";

// Function to save keystrokes to Local Storage
function saveKeystrokes(keystrokes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(keystrokes));
}

// Function to load keystrokes from Local Storage
function loadKeystrokes() {
  const storedKeystrokes = localStorage.getItem(STORAGE_KEY);
  console.log(`storedKeystrokes --> ${storedKeystrokes}`);

  if (storedKeystrokes == null || storedKeystrokes === "undefined") {
    return [];
  } else {
    return JSON.parse(storedKeystrokes);
  }
}

// Function to clear keystrokes from Local Storage
function clearKeystrokes() {
  localStorage.removeItem(STORAGE_KEY);
  return [];
}

// Add a new keystroke
function addKeystroke(keystrokes, key, timestamp) {
  keystrokes.push({ key, timestamp });
  saveKeystrokes(keystrokes);
}

export { addKeystroke, clearKeystrokes, loadKeystrokes };
