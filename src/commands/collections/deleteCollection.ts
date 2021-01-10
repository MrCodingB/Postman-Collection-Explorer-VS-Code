import { commands, Uri, workspace } from 'vscode';
import { TreeViewItem } from '../../collection-explorer/treeViewItem';
import { Command } from '../command';

export class DeleteCollection implements Command {
  name = 'deleteCollection';

  callback(node?: TreeViewItem): void {
    if (node === undefined || !node.isCollection()) {
      return;
    }

    try {
      workspace.fs
        .delete(Uri.file(node.itemObject.filePath))
        .then(() => commands.executeCommand('postman-collection-explorer.refreshView'));
    } catch (err) {
      console.warn('Could not delete collection');
      console.warn(err);
    }
  }
}
