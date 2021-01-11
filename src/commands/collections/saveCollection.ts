import { Uri, workspace } from 'vscode';
import { TreeViewItem } from '../../collection-explorer/treeViewItem';
import { Collection } from '../../postman/Collection';
import { Command } from '../command';
import { commands } from '../commands';

export class SaveCollection implements Command {
  name = 'saveCollection';

  callback(itemOrCollection: Collection | TreeViewItem): void {
    if (!Collection.isCollection(itemOrCollection) && !itemOrCollection.isCollection()) {
      return;
    }

    const collection = Collection.isCollection(itemOrCollection) ? itemOrCollection : itemOrCollection.itemObject;

    try {
      workspace.fs
        .writeFile(
          Uri.file(collection.filePath),
          Buffer.from(JSON.stringify(collection.collection.toJSON())))
        .then(() => commands.executeCommand('postman-collection-explorer.refreshView'));;
    } catch (err) {
      console.warn(err);
    }
  }
}
