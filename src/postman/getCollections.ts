import { readFileSync } from 'fs';
import { Collection } from 'postman-collection';
import { workspace } from 'vscode';

export async function getCollections(): Promise<Collection[]> {
  const collectionFiles = await getCollectionsInWorkspace();

  const collections = collectionFiles
    .map((f) => getCollectionFromFile(f))
    .filter((c) => c !== undefined) as Collection[];

  return collections;
}

function getCollectionsInWorkspace(): Promise<string[]> {
  const promise = new Promise<string[]>((resolve) => {
    workspace
      .findFiles('**/*.postman_collection.json', '**/node_modules/**', 5)
      .then((uris) => resolve(uris.map((u) => u.fsPath)));
  });

  return promise;
}

function getCollectionFromFile(path: string): Collection | undefined {
  try {
    const json = readFileSync(path).toString();
    const obj = JSON.parse(json);
    const collection = new Collection(obj);

    return collection;
  } catch (err) {
    console.warn(`Failed creating collection from path: ${path}`, err);
  }

  return undefined;
}
