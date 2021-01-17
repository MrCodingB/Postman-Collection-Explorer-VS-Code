import { NewmanRunSummary } from 'newman';
import * as vscode from 'vscode';
import { TreeViewItem } from './collection-explorer/treeViewItem';
import { TreeViewItemsProvider } from './collection-explorer/treeViewItemsProvider';
import { commands, COMMAND_ID_PREFIX } from './commands/commands';
import { TestViewItem } from './tests-explorer/testViewItem';
import { TestViewItemsProvider } from './tests-explorer/testViewItemsProvider';

export function activate(context: vscode.ExtensionContext): void {
  const commandNames = Object.keys(commands) as (keyof typeof commands)[];

  for (const name of commandNames) {
    const command = commands[name];

    const disposable = vscode.commands.registerCommand(`${COMMAND_ID_PREFIX}.${name}`, command);

    context.subscriptions.push(disposable);
  }

  const treeViewItemsProvider = new TreeViewItemsProvider();
  vscode.window.registerTreeDataProvider('postmanCollectionExplorer', treeViewItemsProvider);
  vscode.commands.registerCommand(`${COMMAND_ID_PREFIX}.refreshCollectionView`, (args?: TreeViewItem) => treeViewItemsProvider.refresh(args));

  const testViewItemsProvider = new TestViewItemsProvider();
  vscode.window.registerTreeDataProvider('postmanTestExplorer', testViewItemsProvider);
  vscode.commands.registerCommand(`${COMMAND_ID_PREFIX}.refreshTestView`, (args?: TestViewItem) => testViewItemsProvider.refresh(args));
  vscode.commands.registerCommand(`${COMMAND_ID_PREFIX}.setRunSummaries`, (args?: NewmanRunSummary[]) => testViewItemsProvider.setRunSummaries(args));
}

// export function deactivate(): void { }
