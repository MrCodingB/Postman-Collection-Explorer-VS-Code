import { Command } from './command';
import { HelloWorld } from './helloWorld';

export const commands: any & { new(): Command }[] = [
  HelloWorld
];
