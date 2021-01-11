import { Item, ItemGroup } from 'postman-collection';
import { Command } from '../command';
import { window, workspace } from 'vscode';
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

      const workspaceFolders = workspace.workspaceFolders;
      if (workspaceFolders === undefined || workspaceFolders[0] === undefined) {
        window.showWarningMessage('You have to open a folder to create a new collection');
        return;
      }

      const itemGroup = new ItemGroup<Item>({ name });
      const folder = new Folder(parentNode.itemObject, itemGroup);

      const collection = parentNode.isCollection() ? parentNode.itemObject : getCollection(parentNode.itemObject);

      collection.addChild(folder);

      runCommand('saveCollection', collection);
    });
}
