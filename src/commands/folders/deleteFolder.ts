import { commands } from 'vscode';
import { TreeViewItem } from '../../collection-explorer/treeViewItem';
import { getCollection } from '../../utils';

export function deleteFolder(node?: TreeViewItem): void {
  if (node === undefined || !node.isFolder()) {
    return;
  }

  const collection = getCollection(node.itemObject);
  collection.removeChild(node.itemObject);

  commands.executeCommand('postman-collection-explorer.refreshView');
}
