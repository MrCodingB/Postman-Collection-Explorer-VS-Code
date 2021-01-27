import { commands } from 'vscode';
import { PostmanItemModel } from '../collection-explorer/postmanItemModel';
import { Collection } from '../postman/Collection';
import { getCollections } from '../postman/getCollections';
import { RunSummary } from '../postman/newmanTypes';
import { getCollection } from '../utils';
import { runWithNewman } from '../utils/runWithNewman';
import { EXTENSION_PREFIX } from './commands';

async function runTestsForItem(item: PostmanItemModel | Collection): Promise<RunSummary> {
  const collection = Collection.isCollection(item) ? item : getCollection(item.itemObject);

  const [err, summary] = await runWithNewman({
    collection: collection.filePath,
    folder: Collection.isCollection(item) ? undefined : item.itemObject.name
  });

  if (err !== null) {
    throw err;
  }

  return summary;
}

export async function runTests(item?: PostmanItemModel | Collection): Promise<void> {
  let summaries: RunSummary[] | undefined;

  if (item === undefined) {
    const collections = await getCollections();

    summaries = await Promise.all(collections.map((c) => runTestsForItem(c)));
  } else {
    summaries = [await runTestsForItem(item)];
  }

  commands.executeCommand(`${EXTENSION_PREFIX}.setRunSummaries`, summaries);
}
