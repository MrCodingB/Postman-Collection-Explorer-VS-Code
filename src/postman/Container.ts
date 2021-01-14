import { Collection, Item, ItemGroup } from 'postman-collection';
import { Folder } from './Folder';
import { Request } from './Request';

export abstract class Container {
  public abstract rootItem: Collection | ItemGroup<Item>;
  public children: (Folder | Request)[] = [];

  public addChild(child: Folder | Request): void {
    this.rootItem.items.add(child.rootItem);

    this.children.push(child);
  }

  public removeChild(child: Folder | Request): void {
    this.rootItem.items.remove(child.rootItem, {});

    this.children.splice(this.children.indexOf(child), 1);
  }
}
