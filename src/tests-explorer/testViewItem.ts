import { TreeItem, TreeItemCollapsibleState } from 'vscode';

export class TestViewItem extends TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: TreeItemCollapsibleState,
    public readonly failed: boolean = false
  ) {
    super(label, collapsibleState);
  }

  public static create(object: any): TestViewItem {
    console.log('Collection: ', object);
    const collapsibleState = TreeItemCollapsibleState.None;



    return new TestViewItem(object.name, collapsibleState);
  }
}
