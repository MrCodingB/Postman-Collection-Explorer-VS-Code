import { join } from 'path';
import { Collection, Item, ItemGroup } from 'postman-collection';
import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from 'vscode';
import { isCollection, isItemGroup } from '../postman/typeChecks';

export class TreeViewItem extends TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: TreeItemCollapsibleState,
    public readonly itemObject: Collection | ItemGroup<Item> | Item
  ) {
    super(label, collapsibleState);
    this.tooltip = `${this.label}`;
    this.description = itemObject.description?.toString();
    this.id = this.itemObject.id;
    this.contextValue = isCollection(itemObject) ? 'collection' : isItemGroup(itemObject) ? 'itemGroup' : 'item';
  }

  iconPath = this.getIcon();

  public static create(object: Collection | ItemGroup<Item> | Item): TreeViewItem {
    let collapsibleState = TreeItemCollapsibleState.None;

    if (isItemGroup(object) || isCollection(object)) {
      const childCount = object.items.count();

      if (childCount > 0) {
        collapsibleState = TreeItemCollapsibleState.Collapsed;
      }
    }

    return new TreeViewItem(object.name, collapsibleState, object);
  }

  public isCollection(): this is TreeItem & { itemObject: Collection } {
    return Collection.isCollection(this.itemObject);
  }

  public isItemGroup(): this is TreeItem & { itemObject: ItemGroup<Item> } {
    return ItemGroup.isItemGroup(this.itemObject);
  }

  public isItem(): this is TreeItem & { itemObject: Item } {
    return Item.isItem(this.itemObject);
  }

  /**
   * Gets the icon for the TreeViewItem representing it's type and state
   * - Collection: `archive`
   * - Expanded ItemGroup: `folder-opened`
   * - Collapsed ItemGroup: `folder`
   * - Item: `{
   *     dark: 'dark/${method}.svg',
   *     light: 'light/${method}.svg'
   *   }`
   */
  private getIcon(): ThemeIcon | { dark: string, light: string } {
    if (this.isCollection()) {
      return new ThemeIcon('archive');
    }

    if (this.isItemGroup()) {
      if (this.collapsibleState === TreeItemCollapsibleState.Expanded) {
        return new ThemeIcon('folder-opened');
      }

      return new ThemeIcon('folder');
    }

    if (this.isItem()) {
      return {
        light: join(__dirname, '..', '..', 'assets', 'light', `${this.itemObject.request.method.toLowerCase()}.svg`),
        dark: join(__dirname, '..', '..', 'assets', 'dark', `${this.itemObject.request.method.toLowerCase()}.svg`)
      };
    }

    return new ThemeIcon('export');
  }
}
