// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { existsSync } from 'fs';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "tsc-runner" is now active!');

  let terminal: vscode.Terminal | null;
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand('tsc-compile.tscrunner', () => {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user

    const tsconfig = `{
  "compilerOptions": {
    "module": "commonjs",
    "target": "ES2020",
    "outDir": "out",
    "lib": [
      "ES2020"
    ],
    "sourceMap": true,
    "strict": true   /* enable all strict type-checking options */
    /* Additional Checks */
    // "noImplicitReturns": true, /* Report error when not all code paths in function return a value. */
    // "noFallthroughCasesInSwitch": true, /* Report errors for fallthrough cases in switch statement. */
    // "noUnusedParameters": true,  /* Report errors on unused parameters. */
  }
}`;

    // Open another terminal and show it
    terminal = terminal ?? vscode.window.createTerminal();
    terminal.show();
    
    // If there is no tsconfig.json, create it
    // Then run compile
    vscode.workspace.findFiles('tsconfig.json').then((value) => {
      if (!value.length) {
        // in order not to show terminal can be null warning, I added "?"
        terminal?.sendText(`echo "${tsconfig.replace(/\"/g, '\\"')}" >> tsconfig.json`);
        vscode.window.showInformationMessage('tsconfig.json was created!');
      }
    });
    terminal.sendText('tsc');
  });

  const button =  vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
  button.command = 'tsc-compile.tscrunner';
  button.color = new vscode.ThemeColor('#ff00ff');
  button.tooltip = 'Run $tsc to compile.\n If there is no tsconfig.json, create it at first.';
  button.text = 'tsc';
  button.show();
  context.subscriptions.push(button);

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
