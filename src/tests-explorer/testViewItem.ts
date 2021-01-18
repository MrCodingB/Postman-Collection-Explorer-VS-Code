import { join } from 'path';
import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import { RunExecution, RunExecutionAssertion, RunSummary } from '../postman/newmanTypes';

export class TestViewItem extends TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: TreeItemCollapsibleState,
    public readonly itemObject: RunSummary | RunExecution | RunExecutionAssertion,
    type: 'test' | 'request' | 'collection',
    public readonly status: 'passed' | 'failed' | 'errored' = 'errored',
    public readonly id?: string
  ) {
    super(label, collapsibleState);
    this.iconPath = join(__dirname, '..', '..', 'assets', `${this.status}.svg`);
    this.contextValue = type;
  }

  public static createFromSummary(summary: RunSummary): TestViewItem {
    const collapsibleState = summary.run.executions.length > 0 ? TreeItemCollapsibleState.Collapsed : TreeItemCollapsibleState.None;
    const failed = summary.run.failures.length > 0;
    const status = summary.error ? 'errored' : failed ? 'failed' : 'passed';

    return new TestViewItem(summary.collection.info.name, collapsibleState, summary, 'collection', status, summary.collection.id);
  }

  public static createFromExecution(execution: RunExecution): TestViewItem {
    const collapsibleState = execution.assertions && execution.assertions.length > 0 ? TreeItemCollapsibleState.Collapsed : TreeItemCollapsibleState.None;
    const failed = execution.assertions && execution.assertions.find((e) => e.error !== undefined) !== undefined;
    const status = failed ? 'failed' : 'passed';

    return new TestViewItem(execution.item.name, collapsibleState, execution, 'request', status, execution.item.id);
  }

  public static createFromAssertion(assertion: RunExecutionAssertion): TestViewItem {
    const failed = assertion.error !== undefined;
    const status = failed ? 'failed' : 'passed';

    return new TestViewItem(assertion.assertion, TreeItemCollapsibleState.None, assertion, 'test', status);
  }

  public isCollection(): this is { type: 'collection'; objectItem: RunSummary } {
    return this.contextValue === 'collection';
  }

  public isRequest(): this is { type: 'request'; objectItem: RunExecution } {
    return this.contextValue === 'request';
  }

  public isAssertion(): this is { type: 'test'; objectItem: RunExecutionAssertion } {
    return this.contextValue === 'test';
  }
}
