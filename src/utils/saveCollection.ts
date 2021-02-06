import { commands, Uri, workspace } from 'vscode';
import { EXTENSION_PREFIX } from '../commands/commands';
import { Collection } from '../postman';
import { PostmanItemModel } from '../views/postmanItems/postmanItemModel';

export async function saveCollection(itemOrCollection?: Collection | PostmanItemModel): Promise<void> {
  if (itemOrCollection === undefined ||
      !Collection.isCollection(itemOrCollection) &&
      !(itemOrCollection?.isCollection !== undefined && itemOrCollection.isCollection())
  ) {
    return;
  }

  const collection = Collection.isCollection(itemOrCollection) ? itemOrCollection : itemOrCollection.itemObject;

  try {
    await workspace.fs.writeFile(
      Uri.file(collection.filePath),
      Buffer.from(JSON.stringify(collection.rootItem.toJSON(), undefined, 4)));

    await commands.executeCommand(`${EXTENSION_PREFIX}.refreshCollectionView`);
  } catch (err) {
    console.warn(`Error while saving collection ${collection.name}\n`, err);
  }
}
