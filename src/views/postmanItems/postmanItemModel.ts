import { join } from 'path';
import { ThemeIcon, TreeItem, TreeItemCollapsibleState } from 'vscode';
import { Collection, Folder, Request } from '../../postman';

export class PostmanItemModel extends TreeItem {
  public contextValue?: 'collection' | 'folder' | 'request';

  constructor(
    public readonly label: string,
    public readonly collapsibleState: TreeItemCollapsibleState,
    public readonly itemObject: Collection | Folder | Request
  ) {
    super(label, collapsibleState);
    this.tooltip = `${this.label}`;
    this.id = this.itemObject.id;
    this.setContextAndIcon();
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

  private setContextAndIcon(): void {
    if (this.isCollection()) {
      this.iconPath =  new ThemeIcon('repo');
      this.contextValue = 'collection';
    } else if (this.isFolder()) {
      if (this.collapsibleState === TreeItemCollapsibleState.Expanded) {
        this.iconPath = new ThemeIcon('folder-opened');
      }

      this.iconPath = new ThemeIcon('folder');
      this.contextValue = 'folder';
    } else if (this.isRequest()) {
      this.iconPath = {
        light: join(__dirname, '..', '..', '..', 'assets', 'light', `${this.itemObject.method.toLowerCase()}.svg`),
        dark: join(__dirname, '..', '..', '..', 'assets', 'dark', `${this.itemObject.method.toLowerCase()}.svg`)
      };
      this.contextValue = 'request';
    } else {
      this.iconPath = new ThemeIcon('export');
    }
  }
}
