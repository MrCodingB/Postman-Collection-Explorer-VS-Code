import { Url } from 'postman-collection';
import { window } from 'vscode';
import { getCollection } from '../../utils';
import { PostmanItemModel } from '../../views/postmanItems/postmanItemModel';
import { runCommand } from '../commands';

export async function editUrl(item?: PostmanItemModel): Promise<void> {
  if (item === undefined || !item.isRequest()) {
    return;
  }

  const request = item.itemObject;
  const url = await window.showInputBox({ value: request.url.toString(), prompt: 'Request URL' });
  if (url === undefined) {
    return;
  }

  request.url = new Url(url);
  await runCommand('saveCollection', getCollection(request));
}
