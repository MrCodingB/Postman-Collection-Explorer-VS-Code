import { window } from 'vscode';
import { Collection } from '../postman';
import { save } from '../utils';
import { PostmanItemModel } from '../views/postmanItems/postmanItemModel';
import { runCommand } from './commands';

export async function rename(item?: PostmanItemModel): Promise<void> {
  if (item === undefined) {
    return;
  }

  const object = item.itemObject;
  const oldName = object.name;

  const name = await window.showInputBox({ placeHolder: 'Name', value: oldName, prompt: 'The new name of the item' });
  if (name === undefined) {
    return;
  }

  if (Collection.isCollection(object)) {
    await runCommand('remove', item);
    object.filePath = object.filePath.replace(new RegExp(oldName, 'g'), name);
  }

  object.name = name;

  return save(object);
}
