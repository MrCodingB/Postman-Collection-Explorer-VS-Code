import { commands, Uri, workspace } from 'vscode';
import { EXTENSION_PREFIX } from '../commands/commands';
import { Collection } from '../postman';
import { PostmanItemModel } from '../views/postmanItems/postmanItemModel';
import { getCollection } from './getCollection';
import { isPostmanItem, PostmanItem } from './typeChecks';

export async function save(item: PostmanItem | PostmanItemModel): Promise<void> {
  if (item === undefined) {
    return;
  }

  const postmanItem = isPostmanItem(item) ? item : item.itemObject;
  const collection = Collection.isCollection(postmanItem) ? postmanItem : getCollection(postmanItem);

  try {
    await workspace.fs.writeFile(
      Uri.file(collection.filePath),
      Buffer.from(JSON.stringify(collection.rootItem.toJSON(), undefined, 4)));

    await commands.executeCommand(`${EXTENSION_PREFIX}.refreshCollectionView`);
  } catch (err) {
    console.warn(`Error while saving collection ${collection.name}\n`, err);
  }
}
