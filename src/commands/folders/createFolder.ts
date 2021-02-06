import { Item, ItemGroup } from 'postman-collection';
import { window } from 'vscode';
import { Folder } from '../../postman';
import { PostmanItemModel } from '../../views/postmanItems/postmanItemModel';
import { getCollection, saveCollection } from '../../utils';

export function createFolder(parentNode?: PostmanItemModel): void {
  if (parentNode === undefined || !(parentNode.isCollection() || parentNode.isFolder())) {
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

      saveCollection(getCollection(parent));
    });
}
