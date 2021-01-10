import { Item, ItemGroup } from 'postman-collection';
import { TreeDataProvider, TreeItem, window, workspace } from 'vscode';
import { getCollections } from '../postman/getCollections';
import { TreeViewItem } from './item';

export class TreeViewItemsProvider implements TreeDataProvider<TreeViewItem> {
  getTreeItem(element: TreeViewItem): TreeItem {
    return element;
  }

  async getChildren(element?: TreeViewItem): Promise<TreeViewItem[]> {
    if (workspace.workspaceFolders === undefined || workspace.workspaceFolders.length === 0) {
      return [];
    }

    if (element) {
      return this.getChildrenAsItems(element);
    } else {
      const collections = await getCollections();
      if (collections.length === 0) {
        window.showInformationMessage('Workspace has no postman collections');
      } else if (collections.length === 1) {
        return this.getChildren(TreeViewItem.create(collections[0]));
      }

      return collections.map(TreeViewItem.create);
    }
  }

  private getChildrenAsItems(element: TreeViewItem): TreeViewItem[] {
    if (!element.isCollection() && !element.isItemGroup()) {
      return [];
    }

    var items = element.itemObject.items;

    if (items === undefined) {
      return [];
    }

    return items.map((i) => TreeViewItem.create(i));
  }
}
