import * as vscode from 'vscode';

import { createCollection } from './collections/createCollection';
import { deleteCollection } from './collections/deleteCollection';
import { editCollectionDescription } from './collections/editCollectionDescription';
import { saveCollection } from './collections/saveCollection';
import { createFolder } from './folders/createFolder';
import { deleteFolder } from './folders/deleteFolder';
import { createRequest } from './requests/createRequest';
import { deleteRequest } from './requests/deleteRequest';
import { helloWorld } from './helloWorld';
import { runTests } from './runTests';

export const EXTENSION_PREFIX = 'postman-collection-explorer';

export const commands = {
  helloWorld,
  createCollection,
  deleteCollection,
  editCollectionDescription,
  saveCollection,
  createFolder,
  deleteFolder,
  createRequest,
  deleteRequest,
  runTests,
  getContext: (): vscode.ExtensionContext => ({} as vscode.ExtensionContext)
};

export type Commands = typeof commands;

export async function runCommand<
  N extends keyof typeof commands = keyof typeof commands,
  A extends Parameters<typeof commands[N]> = Parameters<typeof commands[N]>,
  R extends ReturnType<typeof commands[N]> = ReturnType<typeof commands[N]>
>(name: N, ...args: A): Promise<R> {
  return new Promise<R>((resolve) => {
    vscode.commands
      .executeCommand(`${EXTENSION_PREFIX}.${name}`, ...args)
      .then((result) => resolve(result as R));
  });
}
