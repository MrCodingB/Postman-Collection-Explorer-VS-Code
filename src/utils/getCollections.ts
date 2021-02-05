import { readFileSync } from 'fs';
import { workspace } from 'vscode';
import { Collection } from '../postman/collection';
import { Collection as PmCollection } from 'postman-collection';
import { EXTENSION_PREFIX } from '../commands/commands';

async function getCollectionsInWorkspace(): Promise<string[]> {
  const configuration = workspace.getConfiguration(EXTENSION_PREFIX);
  const pattern = configuration.get<string>('collectionFilePattern', '**/*.postman_collection.json');
  const ignore = configuration
    .get<string>('ignorePaths', '**/node_modules/**; **/bin/**; **/out/**')
    .split(';')
    .map((s) => s.trim())
    .filter((s) => s !== '')
    .join(',');

  const collectionFilePaths = await workspace
    .findFiles(pattern, `{${ignore}}`, 5)
    .then((uris) => uris.map((u) => u.fsPath));

  return collectionFilePaths;
}

function getCollectionFromFile(path: string): Collection | undefined {
  try {
    const json = readFileSync(path).toString();
    const obj = JSON.parse(json);
    const pmCollection = new PmCollection(obj);

    return new Collection(pmCollection, path);
  } catch (err) {
    console.warn(`Failed creating collection from path: ${path}\n`, err);
  }

  return undefined;
}

export async function getCollections(): Promise<Collection[]> {
  const collectionFiles = await getCollectionsInWorkspace();

  const collections = (collectionFiles
    .map((f) => getCollectionFromFile(f))
    .filter((c) => c !== undefined) as Collection[])
    .sort((a, b) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0);

  return collections;
}
