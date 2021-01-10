import { Collection as PmCollection } from 'postman-collection';
import { Request } from './Request';
import { Folder } from './Folder';
import { resolveChildren } from './resolveChildren';

export class Collection {
  public id: string;
  public children: (Folder | Request)[];
  public name: string;
  public description: string;

  constructor(public collection: PmCollection) {
    this.id = collection.id;
    this.name = collection.name;
    this.description = collection.description?.toString() ?? '';
    this.children = resolveChildren(this.collection, this);
  }

  public static isCollection(obj: any): obj is Collection {
    const collection = obj.collection;

    return collection !== undefined && PmCollection.isCollection(collection);
  }
}
