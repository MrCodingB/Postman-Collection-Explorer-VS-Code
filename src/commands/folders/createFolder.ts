import { Item, ItemGroup } from 'postman-collection';
import { window } from 'vscode';
import { Folder } from '../../postman/Folder';
import { TreeViewItem } from '../../collection-explorer/treeViewItem';
import { getCollection } from '../../utils';
import { runCommand } from '../commands';

export function createFolder(parentNode?: TreeViewItem): void {
  if (parentNode === undefined || (!parentNode.isCollection() && !parentNode.isFolder())) {
    return;
  }

  window
    .showInputBox({ placeHolder: 'Folder name' })
    .then((name) => {
      if (name === undefined || name === '') {
        return;
      }

      const parent = parentNode.itemObject;

      const itemGroup = new ItemGroup<Item>({ name });
      const folder = new Folder(parent, itemGroup);

      parent.addChild(folder);

      runCommand('saveCollection', getCollection(parent));
    });
}
