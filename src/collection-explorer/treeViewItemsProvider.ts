import { Collection, Item, ItemGroup } from 'postman-collection';
import { TreeDataProvider, TreeItem, window, workspace } from 'vscode';
import { getCollections } from '../postman/getCollections';
import { isCollection, isItem, isItemGroup, isPostmanElement } from '../postman/typeChecks';
import { TreeViewItem } from './treeViewItem';

export class TreeViewItemsProvider implements TreeDataProvider<TreeViewItem> {
  getTreeItem(element: TreeViewItem | Collection | ItemGroup<Item> | Item): TreeItem {
    if (isCollection(element) || isItemGroup(element) || isItem(element)) {
      return TreeViewItem.create(element);
    }

    return element;
  }

  async getChildren(element?: TreeViewItem | Collection | ItemGroup<Item> | Item): Promise<TreeViewItem[]> {
    if (workspace.workspaceFolders === undefined || workspace.workspaceFolders.length === 0) {
      return [];
    }

    if (element) {
      return this.getChildrenAsItems(isPostmanElement(element) ? TreeViewItem.create(element) : element);
    } else {
      const collections = await getCollections();

      if (collections.length === 0) {
        window.showInformationMessage('Workspace has no postman collections');
      } else if (collections.length === 1) {
        return this.getChildren(collections[0]);
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
