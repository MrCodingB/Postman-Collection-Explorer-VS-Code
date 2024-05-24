import { join } from 'path';
import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import { RunExecution, RunExecutionAssertion } from '../../postman';
import { NewmanRunExecution, NewmanRunSummary } from 'newman';

export class CollectionTestModel extends TreeItem {
  readonly status: 'passed' | 'failed' | 'errored';

  constructor(
    readonly itemObject: NewmanRunSummary | NewmanRunExecution | RunExecutionAssertion,
  ) {
    super('', TreeItemCollapsibleState.None);
    this.contextValue = this.getType(itemObject);
    this.status = this.getStatus();
    this.iconPath = join(__dirname, '..', '..', 'assets', `${this.status}.svg`);

    if (this.isCollection()) {
      this.id = this.itemObject.collection.id;
      this.label = this.itemObject.collection.name;

      if (this.itemObject.run.executions.length > 0) {
        this.collapsibleState = TreeItemCollapsibleState.Collapsed;
      }

      this.description = this.itemObject.error && `${this.itemObject.error.name}: ${this.itemObject.error.message}`;
      this.tooltip = this.itemObject.error ? `${this.label} | ${this.description}` : this.label;
    }

    if (this.isRequest()) {
      this.id = this.itemObject.item.id;
      this.label = this.itemObject.item.name;

      if (this.itemObject.assertions && this.itemObject.assertions.length > 0) {
        this.collapsibleState = TreeItemCollapsibleState.Collapsed;
      }
    }

    if (this.isAssertion()) {
      this.label = this.itemObject.assertion;

      this.description = this.itemObject.error && `${this.itemObject.error.name}: ${this.itemObject.error.message}`;
      this.tooltip = this.itemObject.error ? `${this.label} | ${this.description}` : this.label;
    }
  }

  isCollection(): this is { type: 'collection'; itemObject: NewmanRunSummary; id: string; } {
    return this.contextValue === 'collection';
  }

  isRequest(): this is { type: 'request'; itemObject: RunExecution; id: string; } {
    return this.contextValue === 'request';
  }

  isAssertion(): this is { type: 'test'; itemObject: RunExecutionAssertion; } {
    return this.contextValue === 'test';
  }

  // eslint-disable-next-line
  getType(object: any): 'collection' | 'request' | 'test' {
    if (object.run !== undefined) {
      return 'collection';
    }

    if (object.item !== undefined) {
      return 'request';
    }

    return 'test';
  }

  getStatus(): 'failed' | 'errored' | 'passed' {
    if (this.isCollection()) {
      const errorAssertion = this.itemObject.run.executions.find((e) => !e.assertions);

      return this.itemObject.error || errorAssertion ? 'errored' : this.itemObject.run.failures.length > 0 ? 'failed' : 'passed';
    }

    if (this.isRequest()) {
      const failedAssertion = this.itemObject.assertions?.find((e) => !!e.error);

      return failedAssertion ? 'failed' : 'passed';
    }

    if (this.isAssertion()) {
      return this.itemObject.error ? 'failed' : 'passed';
    }

    return 'errored';
  }
}
