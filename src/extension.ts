import * as vscode from 'vscode';
import { ItemsProvider } from './collection-explorer/itemsProvider';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('postman-collection-explorer.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from Postman-Collection-Explorer!');
  });

  vscode.window.registerTreeDataProvider('postmanCollectionExplorer', new ItemsProvider(vscode.workspace.rootPath ?? ''));

	context.subscriptions.push(disposable);
}

export function deactivate() {}
