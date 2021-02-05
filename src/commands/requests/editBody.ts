import { join } from 'path';
import { Uri, window, workspace } from 'vscode';
import { getCollection } from '../../utils';
import { PostmanItemModel } from '../../views/postmanItems/postmanItemModel';
import { runCommand } from '../commands';

export async function editBody(item: PostmanItemModel): Promise<void> {
  if (item === undefined || !item.isRequest()) {
    return;
  }

  const context = await runCommand('getContext');

  const object = item.itemObject;
  const scriptFolderUri = Uri.file(join(context.storageUri?.fsPath ?? context.extensionPath));

  const fileUri = Uri.file(join(scriptFolderUri.fsPath, `Body-${object.id}.json`));

  await workspace.fs.writeFile(fileUri, Buffer.from(object.body ?? ''));

  const document = await workspace.openTextDocument(fileUri);

  const saveListener = workspace.onWillSaveTextDocument((e) => {
    if (e.document.uri === document.uri) {
      object.body = document.getText();

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
