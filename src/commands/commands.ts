import { CreateCollection } from './collections/createCollection';
import { DeleteCollection } from './collections/deleteCollection';
import { SaveCollection } from './collections/saveCollection';
import { Command } from './command';
import { HelloWorld } from './helloWorld';

export const commands: any & { new(): Command }[] = [
  HelloWorld,
  CreateCollection,
  DeleteCollection,
  SaveCollection
];
