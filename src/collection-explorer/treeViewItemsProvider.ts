import { Event, EventEmitter, TreeDataProvider, window, workspace } from 'vscode';
import { Collection } from '../postman/Collection';
import { Folder } from '../postman/Folder';
import { getCollections } from '../postman/getCollections';
import { Request } from '../postman/Request';
import { isPostmanElement } from '../utils';
import { TreeViewItem } from './treeViewItem';

export class TreeViewItemsProvider implements TreeDataProvider<TreeViewItem> {
  private treeDataChanged = new EventEmitter<TreeViewItem | undefined | null | void>();

  public onDidChangeTreeData = this.treeDataChanged.event;

  refresh(data?: TreeViewItem): void {
    this.treeDataChanged.fire(data);
  }

  getTreeItem(element: TreeViewItem | Collection | Folder | Request): TreeViewItem {
    if (Collection.isCollection(element) || Folder.isFolder(element) || Request.isRequest(element)) {
      return TreeViewItem.create(element);
    }

    return element;
  }

  async getChildren(element?: TreeViewItem | Collection | Folder | Request): Promise<TreeViewItem[]> {
    if (workspace.workspaceFolders === undefined || workspace.workspaceFolders.length === 0) {
      return [];
    }

    if (element) {
      return this.getChildrenAsItems(isPostmanElement(element) ? TreeViewItem.create(element) : element);
    } else {
      const collections = await getCollections();

      if (collections.length === 0) {
        window.showInformationMessage('No postman collections found in workspace');
      }

      return collections.map(TreeViewItem.create);
    }
  }

  private getChildrenAsItems(element: TreeViewItem): TreeViewItem[] {
    if (!element.isCollection() && !element.isFolder()) {
      return [];
    }

    var children = element.itemObject.children;

    return children.map((i) => TreeViewItem.create(i));
  }
}
