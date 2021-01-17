import { Event, EventEmitter, TreeDataProvider } from 'vscode';
import { RunSummary } from '../postman/newmanTypes';
import { TestViewItem } from './testViewItem';

export class TestViewItemsProvider implements TreeDataProvider<TestViewItem> {
  public onDidChangeTreeData: Event<TestViewItem | null | undefined | void>;

  private treeDataChanged: EventEmitter<TestViewItem | undefined | null | void>;
  private summaries?: RunSummary[];

  constructor() {
    this.treeDataChanged = new EventEmitter<TestViewItem | undefined | null | void>();
    this.onDidChangeTreeData = this.treeDataChanged.event;
  }

  setRunSummaries(summaries?: RunSummary[]): void {
    this.summaries = summaries;
    this.refresh();
  }

  refresh(data?: TestViewItem): void {
    this.treeDataChanged.fire(data);
  }

  getTreeItem(element: TestViewItem): TestViewItem {
    return element;
  }

  async getChildren(element?: TestViewItem): Promise<TestViewItem[]> {
    if (this.summaries === undefined) {
      return [];
    }

    if (element) {
      return this.getChildrenAsItems();
    } else {
      return this.summaries.map((sum) => TestViewItem.create(sum));
    }
  }

  private getChildrenAsItems(): TestViewItem[] {
    return [];
  }
}
