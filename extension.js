const vscode = require("vscode");
const fs = require("fs");

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
        filters: { "Text files": ["txt"], "All files": ["*"] },
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

  // Command: Stop Recording Keystrokes
  const stopCommand = vscode.commands.registerCommand(
    "code-replay.stop",
    () => {
      if (writeStream) {
        writeStream.end();
        writeStream = null;
        vscode.window.showInformationMessage("Stopped recording keystrokes.");
      } else {
        vscode.window.showWarningMessage("No recording is in progress.");
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
      const keyPressed = change.text || "[BACKSPACE/DELETE]"; // Handle empty changes as backspace/delete
      const logEntry = `[${timestamp}] Key: "${keyPressed}" | File: "${filePath}"\n`;
      writeStream.write(logEntry);
    });
  });

  // Register commands and events
  context.subscriptions.push(startCommand, stopCommand, onTextChange);
}

function deactivate() {
  if (writeStream) {
    writeStream.end();
  }
}

module.exports = {
  activate,
  deactivate,
};
