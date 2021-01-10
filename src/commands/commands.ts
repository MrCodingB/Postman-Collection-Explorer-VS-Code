import { CreateCollection } from './collections/createCollection';
import { DeleteCollection } from './collections/deleteCollection';
import { Command } from './command';
import { HelloWorld } from './helloWorld';

export const commands: any & { new(): Command }[] = [
  HelloWorld,
  CreateCollection,
  DeleteCollection
];
