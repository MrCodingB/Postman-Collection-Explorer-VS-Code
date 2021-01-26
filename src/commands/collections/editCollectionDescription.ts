import { join } from 'path';
import { Uri, window, workspace } from 'vscode';
import { TreeViewItem } from '../../collection-explorer/treeViewItem';
import { runCommand } from '../commands';

export async function editCollectionDescription(item: TreeViewItem): Promise<void> {
  if (!item.isCollection()) {
    return Promise.reject('Only callable on collections from tree view');
  }

  const context = await runCommand('getContext');

  const collection = item.itemObject;

  const fileUri = Uri.file(join(context.storageUri?.fsPath ?? context.extensionPath, `Description-${collection.id}.md`));

  await workspace.fs.writeFile(fileUri, Buffer.from(collection.description));

  const document = await workspace.openTextDocument(fileUri);

  const saveListener = workspace.onWillSaveTextDocument((e) => {
    if (e.document.uri === document.uri) {
      collection.description = document.getText();
      e.waitUntil(runCommand('saveCollection', collection));
    }
  });

  const listener = window.onDidChangeVisibleTextEditors((e) => {
    if (e.find((e) => e.document.uri === document.uri) === undefined) {
      saveListener.dispose();
      listener.dispose();
      workspace.fs.delete(document.uri, { useTrash: false });
    }
  });
}
