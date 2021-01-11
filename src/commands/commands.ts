import { createCollection } from './collections/createCollection';
import { deleteCollection } from './collections/deleteCollection';
import { saveCollection } from './collections/saveCollection';
import { helloWorld } from './helloWorld';
import * as vscode from 'vscode';

export const COMMAND_ID_PREFIX = 'postman-collection-explorer';

export const commands = {
  helloWorld,
  createCollection,
  deleteCollection,
  saveCollection
};

export type Commands = typeof commands;

export function runCommand<
  N extends keyof typeof commands = keyof typeof commands,
  A extends Parameters<typeof commands[N]> = Parameters<typeof commands[N]>
>(name: N, ...args: A): Thenable<unknown> {
  return vscode.commands.executeCommand(`${COMMAND_ID_PREFIX}.${name}`, args);
}
