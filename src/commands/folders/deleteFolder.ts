import { TreeViewItem } from '../../collection-explorer/treeViewItem';
import { getCollection } from '../../utils';
import { runCommand } from '../commands';

export function deleteFolder(node?: TreeViewItem): void {
  if (node === undefined || !node.isFolder()) {
    return;
  }

  const folder = node.itemObject;
  folder.parent.removeChild(folder);

  runCommand('saveCollection', getCollection(folder));
}
