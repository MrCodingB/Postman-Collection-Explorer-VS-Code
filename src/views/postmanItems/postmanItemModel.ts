import { join } from 'path';
import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from 'vscode';
import { Collection, Folder, Request } from '../../postman';

export class PostmanItemModel extends TreeItem {
  public contextValue: 'collection' | 'folder' | 'request';

  constructor(
    public readonly label: string,
    public readonly collapsibleState: TreeItemCollapsibleState,
    public readonly itemObject: Collection | Folder | Request
  ) {
    super(label, collapsibleState);
    this.tooltip = `${this.label}`;
    this.id = this.itemObject.id;
    this.contextValue = this.isCollection() ? 'collection' : this.isFolder() ? 'folder' : 'request';
    this.iconPath = this.getIcon();
  }

  public static create(object: Collection | Folder | Request): PostmanItemModel {
    let collapsibleState = TreeItemCollapsibleState.None;

    if (!Request.isRequest(object)) {
      const childCount = object.children.length;

      if (childCount > 0) {
        collapsibleState = TreeItemCollapsibleState.Collapsed;
      }
    }

    return new PostmanItemModel(object.name, collapsibleState, object);
  }

  public isCollection(): this is TreeItem & { itemObject: Collection; filePath: string } {
    return Collection.isCollection(this.itemObject);
  }

  public isFolder(): this is TreeItem & { itemObject: Folder; filePath: undefined } {
    return Folder.isFolder(this.itemObject);
  }

  public isRequest(): this is TreeItem & { itemObject: Request; filePath: undefined } {
    return Request.isRequest(this.itemObject);
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
  private getIcon(): ThemeIcon | { dark: string; light: string } {
    if (this.isCollection()) {
      return new ThemeIcon('repo');
    }

    if (this.isFolder()) {
      if (this.collapsibleState === TreeItemCollapsibleState.Expanded) {
        return new ThemeIcon('folder-opened');
      }

      return new ThemeIcon('folder');
    }

    if (this.isRequest()) {
      return {
        light: join(__dirname, '..', '..', 'assets', 'light', `${this.itemObject.method.toLowerCase()}.svg`),
        dark: join(__dirname, '..', '..', 'assets', 'dark', `${this.itemObject.method.toLowerCase()}.svg`)
      };
    }

    return new ThemeIcon('export');
  }
}
