/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types */
import { Collection as PmCollection, Item, ItemGroup } from 'postman-collection';
import { Folder } from '../postman/folder';
import { Request } from '../postman/request';
import { Collection } from '../postman/collection';

export type PostmanItem = Collection | Folder | Request;

export type PostmanNativeItem = PmCollection | ItemGroup<Item> | Item;

export function isPostmanCollection(obj: any): obj is PmCollection {
  return PmCollection.isCollection(obj);
}

export function isItemGroup(obj: any): obj is ItemGroup<Item> {
  return ItemGroup.isItemGroup(obj);
}

export function isItem(obj: any): obj is Item {
  return Item.isItem(obj);
}

export function isPostmanNativeItem(obj: any): obj is PostmanNativeItem {
  return isPostmanCollection(obj) || isItemGroup(obj) || isItem(obj);
}

export function isPostmanItem(obj: any): obj is PostmanItem {
  return Collection.isCollection(obj) || Folder.isFolder(obj) || Request.isRequest(obj);
}
