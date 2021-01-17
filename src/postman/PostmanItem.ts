import { PostmanNativeElement } from '../utils';

export abstract class PostmanItem<T extends PostmanNativeElement = PostmanNativeElement> {
  public id: string;
  public name: string;
  public description: string;

  constructor(public rootItem: T) {
    this.id = rootItem.id;
    this.name = rootItem.name;
    this.description = rootItem.description?.toString() ?? '';
  }
}
