import { Collection, Item, ItemGroup } from 'postman-collection';
import { Folder } from './Folder';
import { Request } from './Request';

export abstract class Container {
  public children: (Folder | Request)[] = [];

  public abstract rootItem: Collection | ItemGroup<Item>;

  public addChild(child: Folder | Request): void {
    this.rootItem.items.add(child.rootItem);

    this.children.push(child);
  }

  public removeChild(child: Folder | Request): void {
    this.rootItem.items.remove((c) => c.id === child.rootItem.id, {});

    this.children.splice(this.children.indexOf(child), 1);
  }
}
