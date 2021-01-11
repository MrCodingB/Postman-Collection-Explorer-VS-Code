import { commands, Uri, workspace } from 'vscode';
import { TreeViewItem } from '../../collection-explorer/treeViewItem';

export function deleteCollection(node?: TreeViewItem): void {
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
