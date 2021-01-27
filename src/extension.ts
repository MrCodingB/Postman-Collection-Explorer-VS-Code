import * as vscode from 'vscode';
import { PostmanItemModel } from './collection-explorer/postmanItemModel';
import { PostmanItemsProvider } from './collection-explorer/postmanItemsProvider';
import { commands, EXTENSION_PREFIX } from './commands/commands';
import { RunSummary } from './postman/newmanTypes';
import { CollectionTestModel } from './tests-explorer/CollectionTestModel';
import { CollectionTestsProvider } from './tests-explorer/CollectionTestsProvider';

export function activate(context: vscode.ExtensionContext): void {
  const commandNames = Object.keys(commands) as (keyof typeof commands)[];

  for (const name of commandNames) {
    if (name === 'getContext') {
      context.subscriptions.push(vscode.commands.registerCommand(`${EXTENSION_PREFIX}.getContext`, () => context));
      continue;
    }

    const disposable = vscode.commands.registerCommand(`${EXTENSION_PREFIX}.${name}`, commands[name]);

    context.subscriptions.push(disposable);
  }

  const treeViewItemsProvider = new PostmanItemsProvider();
  context.subscriptions.push(
    vscode.window.registerTreeDataProvider('postmanCollectionExplorer', treeViewItemsProvider),
    vscode.commands.registerCommand(`${EXTENSION_PREFIX}.refreshCollectionView`, (args?: PostmanItemModel) => treeViewItemsProvider.refresh(args))
  );

  const testViewItemsProvider = new CollectionTestsProvider();
  context.subscriptions.push(
    vscode.window.registerTreeDataProvider('postmanTestExplorer', testViewItemsProvider),
    vscode.commands.registerCommand(`${EXTENSION_PREFIX}.refreshTestView`, (args?: CollectionTestModel) => testViewItemsProvider.refresh(args)),
    vscode.commands.registerCommand(`${EXTENSION_PREFIX}.setRunSummaries`, (args?: RunSummary[]) => testViewItemsProvider.setRunSummaries(args))
  );
}

// export function deactivate(): void { }
