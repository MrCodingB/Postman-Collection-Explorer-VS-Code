import { window } from 'vscode';
import { getCollection } from '../utils';
import { PostmanItemModel } from '../views/postmanItems/postmanItemModel';
import { runCommand } from './commands';

export async function rename(item?: PostmanItemModel): Promise<void> {
  if (item === undefined) {
    return;
  }

  const oldName = item.itemObject.name;

  const name = await window.showInputBox({ placeHolder: 'Name', value: oldName, prompt: 'The new name of the item' });
  if (name === undefined) {
    return;
  }

  if (item.isCollection()) {
    await runCommand('remove', item);
    item.itemObject.filePath = item.itemObject.filePath.replace(new RegExp(oldName, 'g'), name);
  }

  item.itemObject.name = name;

  return runCommand('saveCollection', getCollection(item.itemObject));
}
