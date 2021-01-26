import { commands, extensions, workspace } from 'vscode';
import { TreeViewItem } from '../collection-explorer/treeViewItem';
import { getCollection } from '../utils';

export async function viewApiDescription(item: TreeViewItem): Promise<void> {
  const markdownExtension = extensions.getExtension('vscode.markdown-language-features');
  if (markdownExtension === undefined) {
    return;
  }

  await markdownExtension.activate();

  const collection = getCollection(item.itemObject);

  const description = [collection.description];

  collection.children.forEach((c) => description.push(c.description));

  const descriptionDocument = await workspace.openTextDocument({ content: description.join('\n\n'), language: 'markdown' });

  await commands.executeCommand('markdown.showPreview', descriptionDocument.uri);
}
