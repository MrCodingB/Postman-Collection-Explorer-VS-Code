import { Event, RequestAuth, RequestAuthDefinition } from 'postman-collection';
import { isItem, PostmanNativeElement } from '../utils';
import { Auth } from './auth/auth';

export abstract class PostmanItem<T extends PostmanNativeElement = PostmanNativeElement> {
  private _id: string;
  private _name: string;
  private _description: string;
  private _prerequest: string;
  private _test: string;
  private _auth?: Auth;

  get id(): string { return this._id; }
  set id(value: string) {
    this._id = value;
    this.rootItem.id = value;
  }

  get name(): string { return this._name; }
  set name(value: string) {
    this._name = value;
    this.rootItem.name = value;
  }

  get description(): string { return this._description; }
  set description(value: string) {
    this._description = value;
    this.rootItem.description = value;
  }

  get prerequest(): string { return this._prerequest; }
  set prerequest(value: string) {
    this.prerequest = value;
    const event = this.getListener('prerequest');
    if (event) {
      event.script.exec = value.split('\n');
    } else {
      this.rootItem.events.add(new Event({ script: value, listen: 'prerequest' }));
    }
  }

  get test(): string { return this._test; }
  set test(value: string) {
    this._test = value;
    const event = this.getListener('test');
    if (event) {
      event.script.exec = value.split('\n');
    } else {
      this.rootItem.events.add(new Event({ script: value, listen: 'test' }));
    }
  }

  get auth(): Auth | undefined { return this._auth; }
  set auth(value: Auth | undefined) {
    this._auth = value;
    (this.rootItem as PostmanNativeElement & { auth?: RequestAuthDefinition }).auth = value?.toDefinition();
  }

  constructor(public rootItem: T) {
    this._id = rootItem.id;
    this._name = rootItem.name;
    this._description = rootItem.description?.toString() ?? '';
    this._prerequest = this.getListener('prerequest')?.script.toSource() ?? '';
    this._test = this.getListener('test')?.script.toSource() ?? '';

    if (isItem(rootItem)) {
      this._auth = new Auth(rootItem.getAuth().toJSON());
    } else {
      const authDefinition = (rootItem as PostmanNativeElement & { auth?: RequestAuth}).auth?.toJSON();

      if (authDefinition !== undefined) {
        this._auth = new Auth(authDefinition);
      }
    }
  }

  private getListener(type: 'test' | 'prerequest'): Event | undefined {
    const listeners = this.rootItem.events.listenersOwn(type);
    return listeners.length > 0 ? listeners[0] : undefined;
  }
}
