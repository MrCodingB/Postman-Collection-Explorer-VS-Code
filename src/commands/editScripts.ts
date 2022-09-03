import { join } from 'path';
import { Uri, window, workspace } from 'vscode';
import { ensureTypingsInStorageLocation } from '../postman';
import { save } from '../utils';
import { PostmanItemModel } from '../views/postmanItems/postmanItemModel';
import { runCommand } from './commands';

async function editScript(item: PostmanItemModel, type: 'test' | 'prerequest'): Promise<void> {
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

      e.waitUntil(save(object));
    }
  });

  const listener = workspace.onDidCloseTextDocument((e) => {
    if (e.uri === document.uri) {
      saveListener.dispose();
      listener.dispose();
      workspace.fs.delete(document.uri, { useTrash: false });
    }
  });

  await window.showTextDocument(document);
}

export async function editTestScript(item?: PostmanItemModel): Promise<void> {
  if (item === undefined) {
    return;
  }

  await editScript(item, 'test');
}

export async function editPrerequestScript(item?: PostmanItemModel): Promise<void> {
  if (item === undefined) {
    return;
  }

  await editScript(item, 'prerequest');
}
