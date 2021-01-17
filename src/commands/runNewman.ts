import { NewmanRunSummary } from 'newman';
import { TreeViewItem } from '../collection-explorer/treeViewItem';
import { Collection } from '../postman/Collection';
import { getCollections } from '../postman/getCollections';
import { getCollection } from '../utils';
import { runWithNewman } from '../utils/runWithNewman';

export async function runNewman(item?: TreeViewItem | Collection): Promise<NewmanRunSummary[]> {
  if (item === undefined) {
    const collections = await getCollections();

    const result: Promise<NewmanRunSummary[]>[] = [];

    for (const collection of collections) {
      const summary = runNewman(collection);

      result.push(summary);
    }

    return Promise
      .all(result)
      .then((array) => array.reduce((prev, cur) => prev.concat(cur), []));
  }

  const collection = Collection.isCollection(item) ? item : getCollection(item.itemObject);

  const [err, summary] = await runWithNewman({
    collection: collection.filePath,
    folder: Collection.isCollection(item) ? undefined : item.itemObject.name
  });

  if (err !== null) {
    throw err;
  }

  return [summary];
}
