import { commands, extensions, workspace } from 'vscode';
import { TreeViewItem } from '../collection-explorer/treeViewItem';
import { Collection } from '../postman/Collection';
import { Folder } from '../postman/Folder';
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

export async function viewApiDescription(item: TreeViewItem): Promise<void> {
  const markdownExtension = extensions.getExtension('vscode.markdown-language-features');
  if (markdownExtension === undefined) {
    return;
  }

  await markdownExtension.activate();

  const collection = getCollection(item.itemObject);

  const description = getFullDescription(collection);

  const descriptionDocument = await workspace.openTextDocument({ content: description.join('\n\n'), language: 'markdown' });

  await commands.executeCommand('markdown.showPreview', descriptionDocument.uri);
}
