import { commands, extensions, workspace } from 'vscode';
import { PostmanItemModel } from '../collection-explorer/postmanItemModel';
import { Collection } from '../postman/Collection';
import { Folder } from '../postman/Folder';
import { getCollections } from '../postman/getCollections';
import { Request } from '../postman/Request';
import { getCollection } from '../utils';

function getFullDescription(item: Collection | Folder | Request): string[] {
  const description = [item.description];

  if (Request.isRequest(item)) {
    return description;
  }

  item.children.forEach((c) => description.push(...getFullDescription(c)));

  return description.filter((d) => d.trim() !== '');
}

export async function viewApiDescription(item?: PostmanItemModel): Promise<void> {
  const markdownExtension = extensions.getExtension('vscode.markdown-language-features');
  if (markdownExtension === undefined) {
    return;
  }

  await markdownExtension.activate();

  const description = item === undefined
    ? (await getCollections()).map((c) => getFullDescription(c))
    : getFullDescription(getCollection(item.itemObject));

  const descriptionDocument = await workspace.openTextDocument({ content: description.join('\n\n'), language: 'markdown' });

  await commands.executeCommand('markdown.showPreview', descriptionDocument.uri);
}
