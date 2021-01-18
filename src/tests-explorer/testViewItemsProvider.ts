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
      return this.getChildrenAsItems(element);
    } else {
      return this.summaries.map((s) => new TestViewItem(s));
    }
  }

  private getChildrenAsItems(element: TestViewItem): TestViewItem[] {
    if (this.summaries === undefined) {
      return [];
    }

    let elementSummary: RunSummary | undefined;

    elementSummary = this.summaries.find((s) => s.collection.id === element.id);
    const collectionFromId = elementSummary?.collection;

    if (collectionFromId !== undefined && elementSummary !== undefined) {
      const executions = elementSummary.run.executions;

      return executions.map((e) => new TestViewItem(e));
    }

    elementSummary = this.summaries.find((s) => s.run.executions.find((e) => e.item.id === element.id) !== undefined);
    const executionFromId = elementSummary?.run.executions.find((e) => e.item.id === element.id);

    if (executionFromId !== undefined) {
      const assertions = executionFromId.assertions;

      if (assertions === undefined) {
        return [];
      }

      return assertions.map((a) => new TestViewItem(a));
    }

    return [];
  }
}
