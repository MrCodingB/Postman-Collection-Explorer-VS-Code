import { Collection } from '../../postman/Collection';
import { Collection as PmCollection } from 'postman-collection';
import { Command } from '../command';
import { commands, Uri, window, workspace } from 'vscode';
import { join } from 'path';

export class CreateCollection implements Command {
  name = 'createCollection';

  callback(): void {
    window
      .showInputBox({ placeHolder: 'Collection name' })
      .then((name) => {
        if (name === undefined || name === '') {
          return;
        }

        const workspaceFolders = workspace.workspaceFolders;
        if (workspaceFolders === undefined || workspaceFolders[0] === undefined) {
          window.showWarningMessage('You have to open a folder to create a new collection');
          return;
        }

        const pmCollection = new PmCollection({ name });
        const filePath = join(workspaceFolders[0].uri.fsPath, `${name}.postman_collection.json`);
        const collection = new Collection(pmCollection, filePath);

        try {
          workspace.fs
            .writeFile(
              Uri.file(filePath),
              Buffer.from(JSON.stringify(collection.collection.toJSON())))
            .then(() => commands.executeCommand('postman-collection-explorer.refreshView'));;
        } catch (err) {
          console.warn(err);
        }
      });
  }
}
