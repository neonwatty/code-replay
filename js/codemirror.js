import { isDarkMode } from "./theme-check.js";
const codeTheme = isDarkMode ? "dracula" : "default";

let inputEditor;
let outputEditor;

window.addEventListener("load", function () {
  console.log("codemirror loaded");
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
