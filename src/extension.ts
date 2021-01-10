import * as vscode from 'vscode';
import { TreeViewItemsProvider } from './collection-explorer/treeViewItemsProvider';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('postman-collection-explorer.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from Postman-Collection-Explorer!');
  });

  vscode.window.registerTreeDataProvider('postmanCollectionExplorer', new TreeViewItemsProvider());

  context.subscriptions.push(disposable);
}

export function deactivate() {}
