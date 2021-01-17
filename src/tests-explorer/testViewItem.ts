import { join } from 'path';
import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import { RunSummary } from '../postman/newmanTypes';

export class TestViewItem extends TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: TreeItemCollapsibleState,
    public readonly status: 'passed' | 'failed' | 'errored' = 'errored'
  ) {
    super(label, collapsibleState);
    this.iconPath = join(__dirname, '..', '..', 'assets', `${this.status}.svg`);
  }

  public static create(object: any): TestViewItem {
    console.log('Collection: ', object);
    const collapsibleState = TreeItemCollapsibleState.None;

    return new TestViewItem(object.name, collapsibleState);
  }

  public static createFromSummary(summary: RunSummary): TestViewItem {
    console.log('Summary: ', summary);

    const collapsibleState = summary.run.executions.length > 0 ? TreeItemCollapsibleState.Collapsed : TreeItemCollapsibleState.None;
    const failed = summary.run.failures.length > 0;
    const status = failed ? 'failed' : summary.error ? 'errored' : 'passed';

    return new TestViewItem(summary.collection.info.name, collapsibleState, status);
  }
}
