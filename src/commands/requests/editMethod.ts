import { window } from 'vscode';
import { PostmanItemModel } from '../../collection-explorer/postmanItemModel';
import { METHODS, RequestMethod } from '../../postman/methods';
import { getCollection } from '../../utils';
import { runCommand } from '../commands';

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

  await runCommand('saveCollection', getCollection(object));
}
