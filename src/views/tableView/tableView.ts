import { VariableDefinition } from 'postman-collection';
import { Event, EventEmitter, Uri, ViewColumn, WebviewPanel, window } from 'vscode';
import { EXTENSION_PREFIX, runCommand } from '../../commands/commands';
import { getNonce } from '../../utils';

export class TableView {
  onChange: Event<VariableDefinition[]>;

  private onChangeEmitter: EventEmitter<VariableDefinition[]>;

  private panel: WebviewPanel;

  constructor(public variables: VariableDefinition[], title: string) {
    this.onChangeEmitter = new EventEmitter<VariableDefinition[]>();

    this.onChange = this.onChangeEmitter.event;

    this.panel = window.createWebviewPanel(`${EXTENSION_PREFIX}.tableView`, title, ViewColumn.Active, { enableScripts: true });

    this.getWebViewHtml().then((html) => this.panel.webview.html = html);

    this.panel.webview.onDidReceiveMessage((e) => {
      if (e.type === 'dataChanged') {
        this.onChangeEmitter.fire(e.data);
      } else if (e.type === 'requestInitialData') {
        this.panel.webview.postMessage({ type: 'initialData', data: this.variables });
      }
    });

    this.variables.forEach((v) => v.description = v.description?.toString());
  }

  private async getWebViewHtml(): Promise<string> {
    const context = await runCommand('getContext');

    const baseUri = Uri.joinPath(context.extensionUri, 'web');

    const styleGlobalUri = this.getUri(baseUri, 'global.css');
    const styleVSCodeUri = this.getUri(baseUri, 'vscode.css');
    const styleTableViewUri = this.getUri(baseUri, 'tableView.css');
    const scriptUri = this.getUri(baseUri, 'tableView.js');

    const nonce = getNonce();

    return /* html */`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${this.panel.webview.cspSource}; script-src 'nonce-${nonce}'">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="${styleGlobalUri}" rel="stylesheet">
        <link href="${styleVSCodeUri}" rel="stylesheet">
        <link href="${styleTableViewUri}" rel="stylesheet">

        <script src="${scriptUri}" nonce="${nonce}"></script>

        <title>${this.panel.title}</title>
      </head>
      <body>
      </body>
      </html>
    `;
  }

  private getUri(baseUri: Uri, ...pathSegments: string[]): Uri {
    return this.panel.webview.asWebviewUri(Uri.joinPath(baseUri, ...pathSegments));
  }
}
