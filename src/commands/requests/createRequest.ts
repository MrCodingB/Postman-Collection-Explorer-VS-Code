import { Item } from 'postman-collection';
import { window } from 'vscode';
import { getCollection, save } from '../../utils';
import { Request } from '../../postman';
import { PostmanItemModel } from '../../views/postmanItems/postmanItemModel';

export async function createRequest(parentNode?: PostmanItemModel): Promise<void> {
  if (parentNode === undefined || !(parentNode.isCollection() || parentNode.isFolder())) {
    return;
  }

  const name = await window.showInputBox({ placeHolder: 'Request name' });
  if (name === undefined || name === '') {
    return;
  }

  const item = new Item({ name });
  const request = new Request(parentNode.itemObject, item);

  parentNode.itemObject.addChild(request);

  const collection = getCollection(parentNode.itemObject);

  await save(collection);
}
