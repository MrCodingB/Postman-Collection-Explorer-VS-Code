import { rmSync } from 'fs';
import { TreeViewItem } from '../../collection-explorer/treeViewItem';
import { Command } from '../command';

export class DeleteCollection implements Command {
  name = 'deleteCollection';

  callback(node?: TreeViewItem): void {
    if (node === undefined || !node.isCollection()) {
      return;
    }

    try {
      rmSync(node.itemObject.filePath);
    } catch (err) {
      console.warn('Could not delete collection');
      console.warn(err);
    }
  }
}
