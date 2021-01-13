import { Item, ItemGroup } from 'postman-collection';
import { window } from 'vscode';
import { Folder } from '../../postman/Folder';
import { TreeViewItem } from '../../collection-explorer/treeViewItem';
import { getCollection } from '../../utils';
import { runCommand } from '../commands';

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

      const itemGroup = new ItemGroup<Item>({ name });
      const folder = new Folder(parentNode.itemObject, itemGroup);

      const collection = parentNode.isCollection() ? parentNode.itemObject : getCollection(parentNode.itemObject);

      collection.addChild(folder);

      runCommand('saveCollection', collection);
    });
}
