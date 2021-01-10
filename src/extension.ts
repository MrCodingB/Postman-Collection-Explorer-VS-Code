import * as vscode from 'vscode';
import { TreeViewItemsProvider } from './collection-explorer/treeViewItemsProvider';
import { Command } from './commands/command';
import { commands } from './commands/commands';

const commandPrefix = 'postman-collection-explorer';

export function activate(context: vscode.ExtensionContext) {
  for (const commandClass of commands) {
    const command = new commandClass() as Command;
    if (!command.name.startsWith(commandPrefix)) {
      command.name = `${commandPrefix}.${command.name}`;
    }

    const disposable = vscode.commands.registerCommand(command.name, command.callback, command.thisArg);

    context.subscriptions.push(disposable);
  }

  vscode.window.registerTreeDataProvider('postmanCollectionExplorer', new TreeViewItemsProvider());
}

export function deactivate() {}
