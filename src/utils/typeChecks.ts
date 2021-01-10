import { Collection as PmCollection, Item, ItemGroup } from 'postman-collection';
import { Folder } from '../postman/Folder';
import { Request } from '../postman/Request';
import { Collection } from '../postman/Collection';

export type PostmanElement = Collection | Folder | Request;

export type PostmanNativeElement = PmCollection | ItemGroup<Item> | Item;

export function isPostmanCollection(obj: any): obj is PmCollection {
  return PmCollection.isCollection(obj);
}

export function isItemGroup(obj: any): obj is ItemGroup<Item> {
  return ItemGroup.isItemGroup(obj);
}

export function isItem(obj: any): obj is Item {
  return Item.isItem(obj);
}

export function isPostmanNativeElement(obj: any): obj is PostmanNativeElement {
  return isPostmanCollection(obj) || isItemGroup(obj) || isItem(obj);
}

export function isPostmanElement(obj: any): obj is PostmanElement {
  return Collection.isCollection(obj) || Folder.isFolder(obj) || Request.isRequest(obj);
}
