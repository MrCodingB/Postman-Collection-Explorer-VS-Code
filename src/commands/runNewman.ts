import { NewmanRunSummary } from 'newman';
import { Collection } from '../postman/Collection';
import { Folder } from '../postman/Folder';
import { getCollections } from '../postman/getCollections';
import { Request } from '../postman/Request';
import { runWithNewman } from '../utils/runWithNewman';

export async function runNewman(collection?: Collection, folders?: (Folder | Request)[]): Promise<NewmanRunSummary[]> {
  console.log('I got run without being registered');

  if (collection === undefined) {
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

  const [err, summary] = await runWithNewman({
    collection: collection.filePath,
    folder: folders?.map((f) => f.name)
  });

  if (err !== null) {
    throw err;
  }

  return [summary];
}
