import { isDarkMode } from "./theme-check.js";
const codeTheme = isDarkMode ? "dracula" : "default";

let inputEditor;
let outputEditor;

// Copy all text from the CodeMirror editor
document.getElementById("copyButton").addEventListener("click", () => {
  const text = outputEditor.getValue();
  navigator.clipboard
    .writeText(text)
    .then(() => {
      alert("Text copied to clipboard!");
    })
    .catch((err) => {
      console.error("Failed to copy: ", err);
    });
});

window.addEventListener("load", function () {
  inputEditor = CodeMirror.fromTextArea(document.getElementById("inputArea"), {
    lineNumbers: true,
    mode: "python",
    theme: codeTheme,
    matchBrackets: true,
    indentUnit: 4,
    tabSize: 4,
  });

  outputEditor = CodeMirror.fromTextArea(
    document.getElementById("outputArea"),
    {
      lineNumbers: true,
      mode: "python",
      theme: codeTheme,
      matchBrackets: true,
      indentUnit: 4,
      tabSize: 4,
    }
  );
});

export { inputEditor, outputEditor };
