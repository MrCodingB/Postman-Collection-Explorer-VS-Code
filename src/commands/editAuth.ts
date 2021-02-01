import { window } from 'vscode';
import { PostmanItemModel } from '../collection-explorer/postmanItemModel';
import { Auth } from '../postman/auth/auth';
import { getCollection } from '../utils';
import { runCommand } from './commands';

export const AUTH_TYPES = {
  inherit: "Inherit auth from parent",
  noauth: "No Auth",
  apikey: "API Key",
  bearer: "Bearer Token",
  basic: "Basic Auth",
  digest: "Digest Auth",
  oauth1: "OAuth 1.0",
  oauth2: "OAtuh 2.0",
  hawk: "Hawk Authentication",
  awsv4: "AWS Signature",
  ntlm: "NTLM Authentication",
  edgegrid: "Akamai EdgeGrid"
};

type AuthPick = {
  key: keyof typeof AUTH_TYPES;
  label: string;
};

async function showAuthPicker(): Promise<AuthPick | undefined> {
  const items = (Object.keys(AUTH_TYPES) as (keyof typeof AUTH_TYPES)[]).map((v) => ({ key: v, label: AUTH_TYPES[v] }));

  return window.showQuickPick<AuthPick>(items, { canPickMany: false, placeHolder: 'Authorization' });
}

export async function editAuth(item?: PostmanItemModel): Promise<void> {
  if (item === undefined) {
    return;
  }

  const object = item.itemObject;

  const authPick = await showAuthPicker();
  if (authPick === undefined) {
    return;
  }

  if (authPick.key === 'inherit') {
    if (object.auth !== undefined) {
      object.auth.type = undefined;
    }
  } else {
    object.auth = await (object.auth ?? new Auth({ type: authPick.key })).setFromUserInput(authPick.key);
  }

  await runCommand('saveCollection', getCollection(object));
}
