import { Collection as PmCollection, CollectionDefinition } from 'postman-collection';
import { isPostmanCollection, resolveChildren } from '../utils';
import { Container } from './container';

export class Collection extends Container {
  public rootItem: PmCollection;
  public id: string;
  public name: string;
  public description: string;

  constructor(public collection: PmCollection | CollectionDefinition, public filePath: string) {
    super();

    this.rootItem = isPostmanCollection(collection) ? collection : new PmCollection(collection);

    this.id = this.rootItem.id;
    this.name = this.rootItem.name;
    this.description = this.rootItem.description?.toString() ?? '';
    this.children = resolveChildren(this.rootItem, this);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  public static isCollection(obj: any): obj is Collection {
    const collection = obj.rootItem;

    return collection !== undefined && PmCollection.isCollection(collection);
  }
}
