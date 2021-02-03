import { commands } from 'vscode';
import { getCollections, RunSummary, Collection } from '../postman';
import { getCollection, runWithNewman } from '../utils';
import { PostmanItemModel } from '../views/postmanItems/postmanItemModel';
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
