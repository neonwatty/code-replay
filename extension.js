const vscode = require("vscode");
const fs = require("fs");

let openedFiles = new Set(); // Track opened files
let writeStream = null;

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log('Your extension "code-replay" is now active!');

  // Command: Start Recording Keystrokes
  const startCommand = vscode.commands.registerCommand(
    "code-replay.start",
    async () => {
      if (writeStream) {
        vscode.window.showWarningMessage("Recording is already in progress.");
        return;
      }

      // Prompt user to choose the file for saving keystrokes
      const fileUri = await vscode.window.showSaveDialog({
        canSelectMany: false,
        openLabel: "Select a file to save keystrokes",
        filters: { "Text files": ["json"], "All files": ["*"] },
      });

      if (fileUri) {
        const filePath = fileUri.fsPath;
        writeStream = fs.createWriteStream(filePath, { flags: "a" });
        vscode.window.showInformationMessage(
          `Started recording keystrokes to ${filePath}`
        );
      } else {
        vscode.window.showErrorMessage("No file selected. Recording aborted.");
      }
    }
  );

  // Listen for keystrokes in text documents
  const onTextChange = vscode.workspace.onDidChangeTextDocument((event) => {
    if (!writeStream) return; // Do nothing if recording is not active

    const document = event.document;
    if (document.isUntitled || document.uri.scheme !== "file") {
      return; // Ignore untitled or non-file URIs
    }

    const filePath = document.fileName;
    const timestamp = new Date().toISOString();

    event.contentChanges.forEach((change) => {
      let keyPressed = change.text || "[BACKSPACE/DELETE]"; // Default for empty changes

      // Create the log entry
      const logEntry =
        JSON.stringify({
          timestamp: new Date().toISOString(), // Use current timestamp
          key: keyPressed,
          file: event.document.fileName || "Unknown",
        }) + "\n";

      // Write to the log file
      writeStream.write(logEntry);
    });
  });

  // Listen for opening of a new text document
  vscode.workspace.onDidOpenTextDocument((document) => {
    console.log(
      "onDidOpenTextDocument has been activated by document -> ",
      document
    );
    if (!openedFiles.has(document.uri.fsPath)) {
      // Mark the file as opened
      openedFiles.add(document.uri.fsPath);

      // Log the initial content of the new file
      function recordInitialFileContent(filePath) {
        try {
          if (!writeStream) return; // Do nothing if recording is not active
          const initialContent = fs.readFileSync(filePath, "utf-8");
          const timestamp = new Date().toISOString();
          const initialEntry =
            JSON.stringify({
              timestamp: timestamp,
              action: "InitialFileContent",
              file: filePath,
              content: initialContent,
            }) + "\n";

          writeStream.write(initialEntry); // Write initial content to log file
        } catch (err) {
          vscode.window.showErrorMessage(
            `Failed to read file: ${filePath}. Error: ${err.message}`
          );
        }
      }
      recordInitialFileContent(document.uri.fsPath);
    }
  });

  // Record cursor movements
  vscode.window.onDidChangeTextEditorSelection((event) => {
    if (!writeStream) return; // Do nothing if recording is not active

    const positions = event.selections.map((selection) => ({
      line: selection.active.line,
      character: selection.active.character,
    }));

    // Log cursor movement
    const logEntry =
      JSON.stringify({
        timestamp: new Date().toISOString(),
        action: "CursorMovement",
        positions: positions,
        file: event.textEditor.document.fileName,
      }) + "\n";

    writeStream.write(logEntry);
  });

  // Register commands and events
  context.subscriptions.push(startCommand, stopCommand, onTextChange);
}

// Command: Stop Recording Keystrokes
const stopCommand = vscode.commands.registerCommand("code-replay.stop", () => {
  if (writeStream) {
    writeStream.end();
    writeStream = null;
    vscode.window.showInformationMessage("Stopped recording keystrokes.");
  } else {
    vscode.window.showWarningMessage("No recording is in progress.");
  }
});

function deactivate() {
  if (writeStream) {
    writeStream.end();
  }
}

module.exports = {
  activate,
  deactivate,
};
