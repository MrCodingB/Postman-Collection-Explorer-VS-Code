import { Collection } from '../../postman';
import { Collection as PmCollection } from 'postman-collection';
import { window, workspace } from 'vscode';
import { join } from 'path';
import { save } from '../../utils';

export async function createCollection(): Promise<void> {
  const name = await window.showInputBox({ placeHolder: 'Collection name' });
  if (name === undefined || name === '') {
    return;
  }

  const workspaceFolders = workspace.workspaceFolders;
  if (workspaceFolders === undefined || workspaceFolders[0] === undefined) {
    window.showWarningMessage('You have to open a folder to create a new collection');
    return;
  }

  const pmCollection = new PmCollection({ name });
  const filePath = join(workspaceFolders[0].uri.fsPath, `${name}.postman_collection.json`);
  const collection = new Collection(pmCollection, filePath);

  await save(collection);
}
