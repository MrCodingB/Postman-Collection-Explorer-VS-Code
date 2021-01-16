import * as vscode from 'vscode';

import { createCollection } from './collections/createCollection';
import { deleteCollection } from './collections/deleteCollection';
import { saveCollection } from './collections/saveCollection';
import { createFolder } from './folders/createFolder';
import { deleteFolder } from './folders/deleteFolder';
import { createRequest } from './requests/createRequest';
import { deleteRequest } from './requests/deleteRequest';
import { helloWorld } from './helloWorld';
import { runNewman } from './runNewman';

export const COMMAND_ID_PREFIX = 'postman-collection-explorer';

export const commands = {
  helloWorld,
  createCollection,
  deleteCollection,
  saveCollection,
  createFolder,
  deleteFolder,
  createRequest,
  deleteRequest,
  runNewman
};

export type Commands = typeof commands;

export async function runCommand<
  N extends keyof typeof commands = keyof typeof commands,
  A extends Parameters<typeof commands[N]> = Parameters<typeof commands[N]>,
  R extends ReturnType<typeof commands[N]> = ReturnType<typeof commands[N]>
>(name: N, ...args: A): Promise<R> {
  return new Promise<R>((resolve) => {
    vscode.commands
      .executeCommand(`${COMMAND_ID_PREFIX}.${name}`, ...args)
      .then((result: any) => resolve(result));
  });
}
