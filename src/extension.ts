import * as vscode from 'vscode';
import { TreeViewItemsProvider } from './collection-explorer/treeViewItemsProvider';
import { commands } from './commands/commands';

export function activate(context: vscode.ExtensionContext) {
  for (const commandClass of commands) {
    const command = new commandClass();
    const disposable = vscode.commands.registerCommand(command.name, command.callback, command.thisArg);

    context.subscriptions.push(disposable);
  }

  vscode.window.registerTreeDataProvider('postmanCollectionExplorer', new TreeViewItemsProvider());
}

export function deactivate() {}
