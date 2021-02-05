import { commands, extensions, workspace } from 'vscode';
import { Request, Collection, Folder } from '../postman';
import { getCollection, getCollections } from '../utils';
import { PostmanItemModel } from '../views/postmanItems/postmanItemModel';

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
