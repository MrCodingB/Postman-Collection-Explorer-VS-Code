import { commands, Uri, workspace } from 'vscode';
import { Collection } from '../postman';
import { getCollection, saveCollection } from '../utils';
import { PostmanItemModel } from '../views/postmanItems/postmanItemModel';
import { EXTENSION_PREFIX } from './commands';

export async function remove(item?: PostmanItemModel): Promise<void> {
  if (item === undefined) {
    return;
  }

  const object = item.itemObject;
  if (Collection.isCollection(object)) {
    try {
      await workspace.fs.delete(Uri.file(object.filePath));
      await commands.executeCommand(`${EXTENSION_PREFIX}.refreshCollectionView`);
    } catch (err) {
      console.warn('Could not delete collection\n', err);
    }
  } else {
    object.parent.removeChild(object);

    await saveCollection(getCollection(object));
  }
}
