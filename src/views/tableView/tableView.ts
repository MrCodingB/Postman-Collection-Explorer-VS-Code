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
  }

  private async getWebViewHtml(): Promise<string> {
    const context = await runCommand('getContext');

    const styleResetUri = this.panel.webview.asWebviewUri(Uri.joinPath(context.extensionUri, 'web', 'reset.css'));
    const styleVSCodeUri = this.panel.webview.asWebviewUri(Uri.joinPath(context.extensionUri, 'web', 'vscode.css'));
    const scriptUri = this.panel.webview.asWebviewUri(Uri.joinPath(context.extensionUri, 'web', 'tableView.js'));

    const nonce = getNonce();

    return /* html */`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${this.panel.webview.cspSource}; script-src 'nonce-${nonce}'">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="${styleResetUri}" rel="stylesheet">
        <link href="${styleVSCodeUri}" rel="stylesheet">

        <script src="${scriptUri}" nonce="${nonce}"></script>

        <title>${this.panel.title}</title>
      </head>
      <body>
      </body>
      </html>
    `;
  }
}
