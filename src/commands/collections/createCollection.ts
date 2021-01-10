import { writeFileSync } from 'fs';
import { Collection } from '../../postman/Collection';
import { Collection as PmCollection } from 'postman-collection';
import { Command } from '../command';
import { window, workspace } from 'vscode';

export class CreateCollection implements Command {
  name = 'createCollection';

  callback(): void {
    window
      .showInputBox({ placeHolder: 'Collection name' })
      .then((name) => {
        if (name === undefined) {
          return;
        }

        const workspaceFolders = workspace.workspaceFolders;
        if (workspaceFolders === undefined || workspaceFolders[0] === undefined) {
          window.showWarningMessage('You have to open a folder to create a new collection');
          return;
        }

        const pmCollection = new PmCollection({ name });
        const collection = new Collection(pmCollection, workspaceFolders[0].uri.fsPath);

        writeFileSync(collection.filePath, JSON.stringify(collection.collection.toJSON()));
      });
  }
}
