import { Item, ItemGroup } from 'postman-collection';
import { window } from 'vscode';
import { Folder } from '../../postman';
import { PostmanItemModel } from '../../views/postmanItems/postmanItemModel';
import { save } from '../../utils';

export async function createFolder(parentNode?: PostmanItemModel): Promise<void> {
  if (parentNode === undefined || !(parentNode.isCollection() || parentNode.isFolder())) {
    return;
  }

  const name = await window.showInputBox({ placeHolder: 'Folder name' });
  if (name === undefined || name === '') {
    return;
  }

  const parent = parentNode.itemObject;

  const itemGroup = new ItemGroup<Item>({ name });
  const folder = new Folder(parent, itemGroup);

  parent.addChild(folder);

  await save(parent);
}
