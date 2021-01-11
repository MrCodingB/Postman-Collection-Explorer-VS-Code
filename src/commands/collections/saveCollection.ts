import { commands, Uri, workspace } from 'vscode';
import { TreeViewItem } from '../../collection-explorer/treeViewItem';
import { Collection } from '../../postman/Collection';

export function saveCollection(itemOrCollection: Collection | TreeViewItem): void {
  if (!Collection.isCollection(itemOrCollection) && !itemOrCollection.isCollection()) {
    return;
  }

  const collection = Collection.isCollection(itemOrCollection) ? itemOrCollection : itemOrCollection.itemObject;

  try {
    workspace.fs
      .writeFile(
        Uri.file(collection.filePath),
        Buffer.from(JSON.stringify(collection.rootItem.toJSON())))
      .then(() => commands.executeCommand('postman-collection-explorer.refreshView'));;
  } catch (err) {
    console.warn(err);
  }
}
