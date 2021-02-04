import * as vscode from 'vscode';

import { createCollection } from './collections/createCollection';
import { saveCollection } from './collections/saveCollection';
import { createFolder } from './folders/createFolder';
import { createRequest } from './requests/createRequest';
import { editDescription } from './editDescription';
import { viewApiDescription } from './viewApiDescription';
import { remove } from './remove';
import { rename } from './rename';
import { runTests } from './runTests';
import { editPrerequestScript, editTestScript } from './editScripts';
import { editAuth } from './editAuth';
import { editBody } from './requests/editBody';
import { editMethod } from './requests/editMethod';
import { editSettings } from './requests/editSettings';

export const EXTENSION_PREFIX = 'postman-collection-explorer';

export const commands = {
  createCollection,
  saveCollection,
  createFolder,
  createRequest,
  editAuth,
  editBody,
  editDescription,
  editMethod,
  editPrerequestScript,
  editSettings,
  editTestScript,
  remove,
  rename,
  viewApiDescription,
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
