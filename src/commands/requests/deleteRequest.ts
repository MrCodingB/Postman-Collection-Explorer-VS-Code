import { TreeViewItem } from '../../collection-explorer/treeViewItem';
import { getCollection } from '../../utils';
import { runCommand } from '../commands';

export function deleteRequest(node?: TreeViewItem): void {
  if (node === undefined || !node.isRequest()) {
    return;
  }

  const request = node.itemObject;
  request.parent.removeChild(request);

  runCommand('saveCollection', getCollection(request));
}
