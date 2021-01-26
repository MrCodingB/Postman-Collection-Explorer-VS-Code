import { join } from 'path';
import { Uri, window, workspace } from 'vscode';
import { TreeViewItem } from '../collection-explorer/treeViewItem';
import { ensureTypingsInStorageLocation } from '../postman/ensureTypingsInStorageLocation';
import { getCollection } from '../utils';
import { runCommand } from './commands';

export async function editTestScript(item?: TreeViewItem): Promise<void> {
  if (item === undefined) {
    return;
  }

  const context = await runCommand('getContext');

  const object = item.itemObject;
  const scriptFolderUri = Uri.file(join(context.storageUri?.fsPath ?? context.extensionPath, 'test'));

  await ensureTypingsInStorageLocation(scriptFolderUri, 'test');

  const fileUri = Uri.file(join(scriptFolderUri.fsPath, `Tests-${object.id}.ts`));

  await workspace.fs.writeFile(fileUri, Buffer.from(object.test));

  const document = await workspace.openTextDocument(fileUri);

  const saveListener = workspace.onWillSaveTextDocument((e) => {
    if (e.document.uri === document.uri) {
      object.test = document.getText();

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

  await window.showTextDocument(document);
}
