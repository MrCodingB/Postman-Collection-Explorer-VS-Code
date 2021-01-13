import { Collection as PmCollection, CollectionDefinition } from 'postman-collection';
import { Request } from './Request';
import { Folder } from './Folder';
import { isPostmanCollection, resolveChildren } from '../utils';

export class Collection {
  public rootItem: PmCollection;
  public id: string;
  public children: (Folder | Request)[];
  public name: string;
  public description: string;

  constructor(public collection: PmCollection | CollectionDefinition, public filePath: string) {
    this.rootItem = isPostmanCollection(collection) ? collection : new PmCollection(collection);

    this.id = this.rootItem.id;
    this.name = this.rootItem.name;
    this.description = this.rootItem.description?.toString() ?? '';
    this.children = resolveChildren(this.rootItem, this);
  }

  public addChild(item: Folder | Request): void {
    this.rootItem.items.add(item.rootItem);

    this.children.push(item);
  }

  public removeChild(item: Folder | Request): void {
    this.rootItem.items.remove(item.rootItem, {});

    this.children.splice(this.children.indexOf(item), 1);
  }

  public static isCollection(obj: any): obj is Collection {
    const collection = obj.rootItem;

    return collection !== undefined && PmCollection.isCollection(collection);
  }
}
