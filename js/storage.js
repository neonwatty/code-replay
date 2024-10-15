// Function to save name-value pair to Local Storage
function saveScannerPointer(name, value) {
  localStorage.setItem(name, value);
}

// Function to load name-value pairs from storage
function loadScannerPointer() {
  // load each slider pair
  const startSliderActual = localStorage.getItem("scanner_pointer_position");
  return startSliderActual;
}

// Function to clear sliders from Local Storage
function clearScannerPointer() {
  localStorage.removeItem("scanner_pointer_position");
  localStorage.removeItem("scanner_pointer_timestamp");
}

window.addEventListener("load", () => {
  clearScannerPointer();
});

export { clearScannerPointer, loadScannerPointer, saveScannerPointer };
