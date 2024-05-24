import { commands } from 'vscode';
import { Collection } from '../postman';
import { getCollection, getCollections, runWithNewman } from '../utils';
import { PostmanItemModel } from '../views/postmanItems/postmanItemModel';
import { EXTENSION_PREFIX } from './commands';
import { NewmanRunSummary } from 'newman';

async function runTestsForItem(item: PostmanItemModel | Collection): Promise<NewmanRunSummary> {
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
  let summaries: NewmanRunSummary[] | undefined;

  if (item === undefined) {
    const collections = await getCollections();

    summaries = await Promise.all(collections.map((c) => runTestsForItem(c)));
  } else {
    summaries = [await runTestsForItem(item)];
  }

  await commands.executeCommand(`${EXTENSION_PREFIX}.setRunSummaries`, summaries);
}
