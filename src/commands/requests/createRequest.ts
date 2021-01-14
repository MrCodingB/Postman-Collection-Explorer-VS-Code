import { Item } from 'postman-collection';
import { window } from 'vscode';
import { TreeViewItem } from '../../collection-explorer/treeViewItem';
import { getCollection } from '../../utils';
import { runCommand } from '../commands';
import { Request } from '../../postman/Request';

export function createRequest(parentNode?: TreeViewItem): void {
  if (parentNode === undefined || (!parentNode.isCollection() && !parentNode.isFolder())) {
    return;
  }

  window
    .showInputBox({ placeHolder: 'Request name' })
    .then((name) => {
      if (name === undefined || name === '') {
        return;
      }

      const item = new Item({ name });
      const request = new Request(parentNode.itemObject, item);

      parentNode.itemObject.addChild(request);

      const collection = getCollection(parentNode.itemObject);

      runCommand('saveCollection', collection);
    });
}
