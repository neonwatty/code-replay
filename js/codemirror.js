let inputEditor;
let outputEditor;

document.addEventListener("DOMContentLoaded", function () {
  inputEditor = CodeMirror.fromTextArea(document.getElementById("inputArea"), {
    lineNumbers: true,
    mode: "python",
    theme: "default",
    matchBrackets: true,
    indentUnit: 4,
    tabSize: 4,
  });

  outputEditor = CodeMirror.fromTextArea(
    document.getElementById("outputArea"),
    {
      lineNumbers: true,
      mode: "python",
      theme: "default",
      matchBrackets: true,
      indentUnit: 4,
      tabSize: 4,
    }
  );
});

export { inputEditor, outputEditor };
