import { Collection, Item, ItemGroup } from 'postman-collection';

export type PostmanElement = Collection | ItemGroup<Item> | Item;

export function isCollection(obj: any): obj is Collection {
  return Collection.isCollection(obj);
}

export function isItemGroup(obj: any): obj is ItemGroup<Item> {
  return ItemGroup.isItemGroup(obj);
}

export function isItem(obj: any): obj is Item {
  return Item.isItem(obj);
}

export function isPostmanElement(obj: any): obj is PostmanElement {
  return isCollection(obj) || isItemGroup(obj) || isItem(obj);
}
