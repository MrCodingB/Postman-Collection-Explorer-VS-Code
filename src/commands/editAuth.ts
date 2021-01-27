import { RequestAuth, RequestAuthDefinition } from 'postman-collection';
import { window } from 'vscode';
import { PostmanItemModel } from '../collection-explorer/postmanItemModel';
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
  return new Promise<AuthPick>((resolve) => {
    const authPick = window.createQuickPick<AuthPick>();
    authPick.items = (Object.keys(AUTH_TYPES) as (keyof typeof AUTH_TYPES)[]).map((v) => ({ key: v, label: AUTH_TYPES[v] }));
    authPick.canSelectMany = false;
    authPick.placeholder = 'Authorization';

    authPick.onDidAccept(() => resolve(authPick.selectedItems[0]));

    authPick.show();
  });
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

  const auth: RequestAuthDefinition | undefined = authPick.key === 'inherit' ? undefined : { type: authPick.key };
  if (auth === undefined) {
    object.auth = undefined;
    await runCommand('saveCollection', getCollection(object));
    return;
  }

  if (object.auth === undefined) {
    object.auth = new RequestAuth(auth);
  }

  runCommand('saveCollection', getCollection(object));
}
