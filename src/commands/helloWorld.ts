import { window } from 'vscode';
import { Command } from './command';

export class HelloWorld implements Command {
  name = 'postman-collection-explorer.helloWorld';
  callback() {
    window.showInformationMessage('Hello World from Postman-Collection-Explorer!');
  }
}
