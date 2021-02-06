import { window } from 'vscode';
import { METHODS, RequestMethod } from '../../postman';
import { save } from '../../utils';
import { PostmanItemModel } from '../../views/postmanItems/postmanItemModel';

export async function editMethod(item?: PostmanItemModel): Promise<void> {
  if (item === undefined || !item.isRequest()) {
    return;
  }

  const object = item.itemObject;
  const selection = await window.showQuickPick(
    Object.values(METHODS),
    { canPickMany: false, placeHolder: 'Method' }
  ) as RequestMethod | undefined;

  if (selection === undefined) {
    return;
  }

  object.method = selection;

  await save(object);
}
