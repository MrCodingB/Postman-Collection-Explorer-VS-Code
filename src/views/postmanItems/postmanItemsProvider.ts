import { Event, EventEmitter, TreeDataProvider, window, workspace } from 'vscode';
import { Collection, Folder, Request } from '../../postman';
import { getCollections, isPostmanItem } from '../../utils';
import { PostmanItemModel } from './postmanItemModel';

export class PostmanItemsProvider implements TreeDataProvider<PostmanItemModel> {
  public onDidChangeTreeData: Event<PostmanItemModel | null | undefined | void>;

  private treeDataChanged: EventEmitter<PostmanItemModel | undefined | null | void>;

  constructor() {
    this.treeDataChanged = new EventEmitter<PostmanItemModel | undefined | null | void>();
    this.onDidChangeTreeData = this.treeDataChanged.event;
  }

  refresh(data?: PostmanItemModel): void {
    this.treeDataChanged.fire(data);
  }

  getTreeItem(element: PostmanItemModel | Collection | Folder | Request): PostmanItemModel {
    if (Collection.isCollection(element) || Folder.isFolder(element) || Request.isRequest(element)) {
      return PostmanItemModel.create(element);
    }

    return element;
  }

  async getChildren(element?: PostmanItemModel | Collection | Folder | Request): Promise<PostmanItemModel[]> {
    if (workspace.workspaceFolders === undefined || workspace.workspaceFolders.length === 0) {
      return [];
    }

    if (element) {
      return this.getChildrenAsItems(isPostmanItem(element) ? PostmanItemModel.create(element) : element);
    } else {
      const collections = await getCollections();

      if (collections.length === 0) {
        window.showInformationMessage('No postman collections found in workspace');
      }

      return collections.map(PostmanItemModel.create);
    }
  }

  private getChildrenAsItems(element: PostmanItemModel): PostmanItemModel[] {
    if (!element.isCollection() && !element.isFolder()) {
      return [];
    }

    const children = element.itemObject.children;

    return children.map((i) => PostmanItemModel.create(i));
  }
}
