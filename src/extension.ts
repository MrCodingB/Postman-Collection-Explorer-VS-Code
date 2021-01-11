import * as vscode from 'vscode';
import { TreeViewItem } from './collection-explorer/treeViewItem';
import { TreeViewItemsProvider } from './collection-explorer/treeViewItemsProvider';
import { commands, COMMAND_ID_PREFIX } from './commands/commands';

export function activate(context: vscode.ExtensionContext) {
  const commandNames = Object.keys(commands) as (keyof typeof commands)[];

  for (const name of commandNames) {
    const command = commands[name];

    const disposable = vscode.commands.registerCommand(`${COMMAND_ID_PREFIX}.${name}`, command);

    context.subscriptions.push(disposable);
  }

  const treeViewItemsProvider = new TreeViewItemsProvider();
  vscode.window.registerTreeDataProvider('postmanCollectionExplorer', treeViewItemsProvider);
  vscode.commands.registerCommand(`${COMMAND_ID_PREFIX}.refreshView`, (args?: TreeViewItem) => treeViewItemsProvider.refresh(args));
}

export function deactivate() { }
