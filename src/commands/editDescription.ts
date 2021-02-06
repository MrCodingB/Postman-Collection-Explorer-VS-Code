import { join } from 'path';
import { Uri, window, workspace } from 'vscode';
import { save } from '../utils';
import { PostmanItemModel } from '../views/postmanItems/postmanItemModel';
import { runCommand } from './commands';

export async function editDescription(item?: PostmanItemModel): Promise<void> {
  if (item === undefined) {
    return;
  }

  const context = await runCommand('getContext');

  const object = item.itemObject;

  const fileUri = Uri.file(join(context.storageUri?.fsPath ?? context.extensionPath, `Description-${object.id}.md`));

  await workspace.fs.writeFile(fileUri, Buffer.from(object.description));

  const document = await workspace.openTextDocument(fileUri);

  const saveListener = workspace.onWillSaveTextDocument((e) => {
    if (e.document.uri === document.uri) {
      object.description = document.getText();

      e.waitUntil(save(object));
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
