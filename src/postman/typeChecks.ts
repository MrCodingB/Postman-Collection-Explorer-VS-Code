import { Collection, Item, ItemGroup } from 'postman-collection';

export function isCollection(obj: any): obj is Collection {
  return Collection.isCollection(obj);
}

export function isItemGroup(obj: any): obj is ItemGroup<Item> {
  return ItemGroup.isItemGroup(obj);
}

export function isItem(obj: any): obj is Item {
  return Item.isItem(obj);
}
