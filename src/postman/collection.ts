import { Collection as PmCollection, CollectionDefinition, VariableList } from 'postman-collection';
import { isPostmanCollection, resolveChildren } from '../utils';
import { Container } from './container';

export class Collection extends Container<PmCollection> {
  private _variables: VariableList;

  get variables(): VariableList { return this._variables; }
  set variables(value: VariableList) {
    this._variables = value;
    this.rootItem.variables = value;
  }

  constructor(public collection: PmCollection | CollectionDefinition, public filePath: string) {
    super(isPostmanCollection(collection) ? collection : new PmCollection(collection));

    this.children = resolveChildren(this.rootItem, this);
    this._variables = this.rootItem.variables;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  public static isCollection(obj: any): obj is Collection {
    const collection = obj.rootItem;

    return collection !== undefined && PmCollection.isCollection(collection);
  }
}
