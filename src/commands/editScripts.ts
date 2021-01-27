import { join } from 'path';
import { Uri, window, workspace } from 'vscode';
import { TreeViewItem } from '../collection-explorer/treeViewItem';
import { ensureTypingsInStorageLocation } from '../postman/ensureTypingsInStorageLocation';
import { getCollection } from '../utils';
import { runCommand } from './commands';

async function editScript(item: TreeViewItem, type: 'test' | 'prerequest'): Promise<void> {
  const context = await runCommand('getContext');

  const object = item.itemObject;
  const scriptFolderUri = Uri.file(join(context.storageUri?.fsPath ?? context.extensionPath, type));

  await ensureTypingsInStorageLocation(scriptFolderUri, type);

  const fileUri = Uri.file(join(scriptFolderUri.fsPath, `${type === 'test' ? 'Tests' : 'Pre-request Script'}-${object.id}.ts`));

  await workspace.fs.writeFile(fileUri, Buffer.from(object[type]));

  const document = await workspace.openTextDocument(fileUri);

  const saveListener = workspace.onWillSaveTextDocument((e) => {
    if (e.document.uri === document.uri) {
      object[type] = document.getText();

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

export async function editTestScript(item?: TreeViewItem): Promise<void> {
  if (item === undefined) {
    return;
  }

  await editScript(item, 'test');
}

export async function editPrerequestScript(item?: TreeViewItem): Promise<void> {
  if (item === undefined) {
    return;
  }

  await editScript(item, 'prerequest');
}