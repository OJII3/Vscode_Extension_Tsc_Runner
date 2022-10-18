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

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand('tsc-compile.tscrunner', () => {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user

    if (vscode.workspace.workspaceFolders) {
      // If you only open a file, this command will not be run

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

      // if active terminal does not exist, create a new one
      const terminal = vscode.window.activeTerminal ?? vscode.window.createTerminal();
      // then change dirictory to toot folder, in case the current directory was not there
      terminal.sendText(`cd ${vscode.workspace.workspaceFolders[0].uri.path}`);
      terminal.show();

      // If there is no tsconfig.json, create it
      // Then run compile
      vscode.workspace.findFiles('tsconfig.json').then((value) => {

        // value probably exists, but it can be empty (0 is false)
        if (!value.length) {
          // send command line to create tsconfig.json and run tsc
          // $echo content >> filename
          terminal.sendText(`echo "${tsconfig.replace(/\"/g, '\\"')}" >> tsconfig.json \ntsc`);
          vscode.window.showInformationMessage('tsconfig.json was created!');
        }
        else {
          terminal.sendText('tsc');
        }
      });
    }
  });

  // create button and show in status bar below
  const button = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
  button.command = 'tsc-compile.tscrunner';
  button.color = new vscode.ThemeColor('#ff00ff');
  button.tooltip = 'Run $tsc to compile.\n\nCreate tsconfig.json first, if it does not exist';
  button.text = 'tsc';
  button.show();

  context.subscriptions.push(button);
  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
