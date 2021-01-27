import { commands, Uri, workspace } from 'vscode';
import { PostmanItemModel } from '../collection-explorer/postmanItemModel';
import { Collection } from '../postman/Collection';
import { getCollection } from '../utils';
import { EXTENSION_PREFIX, runCommand } from './commands';

export async function remove(item?: PostmanItemModel): Promise<void> {
  if (item === undefined) {
    return;
  }

  const object = item.itemObject;
  if (Collection.isCollection(object)) {
    try {
      await workspace.fs
        .delete(Uri.file(object.filePath))
        .then(() => commands.executeCommand(`${EXTENSION_PREFIX}.refreshCollectionView`));
    } catch (err) {
      console.warn('Could not delete collection');
      console.warn(err);
    }
  } else {
    object.parent.removeChild(object);

    await runCommand('saveCollection', getCollection(object));
  }
}
