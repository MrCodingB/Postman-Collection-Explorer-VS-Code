import { join } from 'path';
import { TextEditor, Uri, window, workspace } from 'vscode';
import { TreeViewItem } from '../collection-explorer/treeViewItem';
import { getCollection } from '../utils';
import { runCommand } from './commands';

export async function editDescription(item: TreeViewItem): Promise<TextEditor> {
  const context = await runCommand('getContext');

  const object = item.itemObject;

  const fileUri = Uri.file(join(context.storageUri?.fsPath ?? context.extensionPath, `Description-${object.id}.md`));

  await workspace.fs.writeFile(fileUri, Buffer.from(object.description));

  const document = await workspace.openTextDocument(fileUri);

  const saveListener = workspace.onWillSaveTextDocument((e) => {
    if (e.document.uri === document.uri) {
      object.description = document.getText();

      const collection = getCollection(object);
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

  return window.showTextDocument(document);
}
