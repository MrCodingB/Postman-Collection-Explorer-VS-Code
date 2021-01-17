import { NewmanRunSummary } from 'newman';
import { Event, EventEmitter, TreeDataProvider, window, workspace } from 'vscode';
import { Collection } from '../postman/Collection';
import { Folder } from '../postman/Folder';
import { getCollections } from '../postman/getCollections';
import { Request } from '../postman/Request';
import { TestViewItem } from './testViewItem';

export class TestViewItemsProvider implements TreeDataProvider<TestViewItem> {
  public onDidChangeTreeData: Event<TestViewItem | null | undefined | void>;

  private treeDataChanged: EventEmitter<TestViewItem | undefined | null | void>;
  private lastRunSummary?: NewmanRunSummary;

  constructor() {
    this.treeDataChanged = new EventEmitter<TestViewItem | undefined | null | void>();
    this.onDidChangeTreeData = this.treeDataChanged.event;
  }

  setLastRunSummary(summary: NewmanRunSummary): void {
    this.lastRunSummary = summary;
    this.refresh();
  }

  refresh(data?: TestViewItem): void {
    this.treeDataChanged.fire(data);
  }

  getTreeItem(element: TestViewItem): TestViewItem {
    if (Collection.isCollection(element) || Folder.isFolder(element) || Request.isRequest(element)) {
      return TestViewItem.create(element);
    }

    return element;
  }

  async getChildren(element?: TestViewItem): Promise<TestViewItem[]> {
    if (workspace.workspaceFolders === undefined || workspace.workspaceFolders.length === 0) {
      return [];
    }

    if (element) {
      return this.getChildrenAsItems(element);
    } else {
      const collections = await getCollections();

      if (collections.length === 0) {
        window.showInformationMessage('No postman collections found in workspace');
      }

      return collections.map(TestViewItem.create);
    }
  }

  private getChildrenAsItems(element: TestViewItem): TestViewItem[] {
    if (!element.isCollection() && !element.isFolder()) {
      return [];
    }

    const children = element.itemObject.children;

    return children.map((i) => TestViewItem.create(i));
  }
}
