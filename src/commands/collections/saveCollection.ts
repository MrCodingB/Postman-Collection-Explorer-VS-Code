import { commands, Uri, workspace } from 'vscode';
import { PostmanItemModel } from '../../collection-explorer/postmanItemModel';
import { Collection } from '../../postman/Collection';

export function saveCollection(itemOrCollection?: Collection | PostmanItemModel): void {
  if (itemOrCollection === undefined || !Collection.isCollection(itemOrCollection) && !(itemOrCollection?.isCollection !== undefined && itemOrCollection.isCollection())) {
    return;
  }

  const collection = Collection.isCollection(itemOrCollection) ? itemOrCollection : itemOrCollection.itemObject;

  try {
    workspace.fs
      .writeFile(
        Uri.file(collection.filePath),
        Buffer.from(JSON.stringify(collection.rootItem.toJSON(), undefined, 4)))
      .then(() => commands.executeCommand('postman-collection-explorer.refreshCollectionView'));
  } catch (err) {
    console.warn(err);
  }
}
