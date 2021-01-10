import * as vscode from 'vscode';
import { TreeViewItem } from './collection-explorer/treeViewItem';
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

  const treeViewItemsProvider = new TreeViewItemsProvider();
  vscode.window.registerTreeDataProvider('postmanCollectionExplorer', treeViewItemsProvider);
  vscode.commands.registerCommand(`${commandPrefix}.refreshView`, (args?: TreeViewItem) => treeViewItemsProvider.refresh(args));
}

export function deactivate() {}
