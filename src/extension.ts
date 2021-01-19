import * as vscode from 'vscode';
import { TreeViewItem } from './collection-explorer/treeViewItem';
import { TreeViewItemsProvider } from './collection-explorer/treeViewItemsProvider';
import { commands, EXTENSION_PREFIX } from './commands/commands';
import { RunSummary } from './postman/newmanTypes';
import { TestViewItem } from './tests-explorer/testViewItem';
import { TestViewItemsProvider } from './tests-explorer/testViewItemsProvider';

export function activate(context: vscode.ExtensionContext): void {
  const commandNames = Object.keys(commands) as (keyof typeof commands)[];

  for (const name of commandNames) {
    const disposable = vscode.commands.registerCommand(`${EXTENSION_PREFIX}.${name}`, commands[name]);

    context.subscriptions.push(disposable);
  }

  const treeViewItemsProvider = new TreeViewItemsProvider();
  context.subscriptions.push(
    vscode.window.registerTreeDataProvider('postmanCollectionExplorer', treeViewItemsProvider),
    vscode.commands.registerCommand(`${EXTENSION_PREFIX}.refreshCollectionView`, (args?: TreeViewItem) => treeViewItemsProvider.refresh(args))
  );

  const testViewItemsProvider = new TestViewItemsProvider();
  context.subscriptions.push(
    vscode.window.registerTreeDataProvider('postmanTestExplorer', testViewItemsProvider),
    vscode.commands.registerCommand(`${EXTENSION_PREFIX}.refreshTestView`, (args?: TestViewItem) => testViewItemsProvider.refresh(args)),
    vscode.commands.registerCommand(`${EXTENSION_PREFIX}.setRunSummaries`, (args?: RunSummary[]) => testViewItemsProvider.setRunSummaries(args))
  );
}

// export function deactivate(): void { }
