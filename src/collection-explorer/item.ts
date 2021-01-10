import { join } from 'path';
import { Collection, Item, ItemGroup } from 'postman-collection';
import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from 'vscode';

export class TreeViewItem extends TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: TreeItemCollapsibleState,
    public readonly collection?: Collection,
    public readonly itemGroup?: ItemGroup<Item>,
    public readonly item?: Item
  ) {
    super(label, collapsibleState);
    this.tooltip = `${this.label}`;
  }

  iconPath = this.collection
    ? new ThemeIcon('archive')
    : this.itemGroup && this.collapsibleState === TreeItemCollapsibleState.Expanded
    ? new ThemeIcon('folder-opened')
    : this.itemGroup
    ? new ThemeIcon('folder')
    : new ThemeIcon('export');

  public static createFromCollection(collection: Collection): TreeViewItem {
    const label = collection.name;
    const childCount = collection.items.count();
    const collapsibleState = childCount === 0 ? TreeItemCollapsibleState.None : TreeItemCollapsibleState.Collapsed;

    return new TreeViewItem(label, collapsibleState, collection);
  }

  public static createFromItemGroup(itemGroup: ItemGroup<Item>): TreeViewItem {
    const label = itemGroup.name;
    const childCount = itemGroup.items.count();
    const collapsibleState = childCount === 0 ? TreeItemCollapsibleState.None : TreeItemCollapsibleState.Collapsed;

    return new TreeViewItem(label, collapsibleState, undefined, itemGroup);
  }

  public static createFromItem(item: Item): TreeViewItem {
    return new TreeViewItem(item.name, TreeItemCollapsibleState.None, undefined, undefined, item);
  }
}
