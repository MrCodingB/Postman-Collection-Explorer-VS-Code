import { readFileSync } from 'fs';
import { workspace } from 'vscode';
import { Collection } from './Collection';
import { Collection as PmCollection } from 'postman-collection';
import { runCommand } from '../commands/commands';

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
    const pmCollection = new PmCollection(obj);

    return new Collection(pmCollection, path);
  } catch (err) {
    console.warn(`Failed creating collection from path: ${path}`, err);
  }

  return undefined;
}

export async function getCollections(): Promise<Collection[]> {
  const collectionFiles = await getCollectionsInWorkspace();

  const collections = (collectionFiles
    .map((f) => getCollectionFromFile(f))
    .filter((c) => c !== undefined) as Collection[])
    .sort((a, b) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0);



  const collection = collections.find((c) => c.name === 'Flask Test Project');
  runCommand('runNewman', collection);



  return collections;
}
