import { Event, EventEmitter, TreeDataProvider } from 'vscode';
import { CollectionTestModel } from './collectionTestModel';
import { NewmanRunSummary } from 'newman';

export class CollectionTestsProvider implements TreeDataProvider<CollectionTestModel> {
  onDidChangeTreeData: Event<CollectionTestModel | null | undefined>;

  private treeDataChanged: EventEmitter<CollectionTestModel | undefined | null>;
  private summaries?: NewmanRunSummary[];

  constructor() {
    this.treeDataChanged = new EventEmitter<CollectionTestModel | undefined | null>();
    this.onDidChangeTreeData = this.treeDataChanged.event;
  }

  setRunSummaries(summaries?: NewmanRunSummary[]): void {
    this.summaries = summaries;
    this.refresh();
  }

  refresh(data?: CollectionTestModel): void {
    this.treeDataChanged.fire(data);
  }

  getTreeItem(element: CollectionTestModel): CollectionTestModel {
    return element;
  }

  async getChildren(element?: CollectionTestModel): Promise<CollectionTestModel[]> {
    if (!this.summaries) {
      return [];
    }

    if (element) {
      return this.getChildrenAsItems(element);
    }

    if (this.summaries.length === 1) {
      return this.getChildrenAsItems(new CollectionTestModel(this.summaries[0]));
    }

    return this.summaries.map((s) => new CollectionTestModel(s));
  }

  private getChildrenAsItems(element: CollectionTestModel): CollectionTestModel[] {
    if (!this.summaries) {
      return [];
    }

    let elementSummary: NewmanRunSummary | undefined;

    elementSummary = this.summaries.find((s) => s.collection.id === element.id);
    const collectionFromId = elementSummary?.collection;

    if (collectionFromId && elementSummary) {
      const executions = elementSummary.run.executions;

      return executions.map((e) => new CollectionTestModel(e));
    }

    elementSummary = this.summaries.find((s) => !!s.run.executions.find((e) => e.item.id === element.id));
    const executionFromId = elementSummary?.run.executions.find((e) => e.item.id === element.id);

    if (executionFromId && executionFromId.assertions) {
      return executionFromId.assertions.map((a) => new CollectionTestModel(a));
    }

    return [];
  }
}
