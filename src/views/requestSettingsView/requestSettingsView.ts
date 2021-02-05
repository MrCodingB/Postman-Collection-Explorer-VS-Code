import { Event, EventEmitter, Uri, ViewColumn, WebviewPanel, window, workspace } from 'vscode';
import { EXTENSION_PREFIX, runCommand } from '../../commands/commands';
import { RequestSettings, REQUEST_SETTINGS } from '../../postman/PostmanSettings';
import { getNonce } from '../../utils';

export class RequestSettingsView {
  onChange: Event<RequestSettings>;

  private onChangeEmitter: EventEmitter<RequestSettings>;

  private panel: WebviewPanel;

  constructor(public settings: RequestSettings, title: string) {
    this.onChangeEmitter = new EventEmitter<RequestSettings>();
    this.onChange = this.onChangeEmitter.event;

    this.panel = window.createWebviewPanel(`${EXTENSION_PREFIX}.tableView`, title, ViewColumn.Active, { enableScripts: true });

    this.getWebViewHtml().then((html) => this.panel.webview.html = html);

    this.panel.webview.onDidReceiveMessage((e) => {
      if (e.type === 'dataChanged') {
        this.dataChanged(e.data);
      } else if (e.type === 'requestInitialData') {
        this.triggerRender();
      }
    });
  }

  private triggerRender(): void {
    this.panel.webview.postMessage({
      type: 'render',
      settings: this.settings,
      settingInfos: this.getSettingInfos()
    });
  }

  private getSettingInfos(): unknown {
    return REQUEST_SETTINGS.map((s) => {
      if (s.default === 'settings') {
        s.default = this.getSettingFromConfig(s.key);
      }

      return s;
    });
  }

  private async dataChanged(data: { key: string; value?: string }): Promise<void> {
    const key = (data.key.endsWith('.default')
      ? data.key.substring(0, data.key.length - '.default'.length)
      : data.key) as keyof RequestSettings;

    const setting = REQUEST_SETTINGS.find((s) => s.key === key);
    const type = setting?.type;
    if (setting === undefined || type === undefined) {
      return;
    }

    let settingValue = this.settings[key];
    if (data.value === undefined) {
      settingValue = undefined;
    } else {
      switch (type) {
        case 'boolean':
          settingValue = Boolean(data.value);
          break;
        case 'array':
          settingValue = data.value.split(',').map((v) => v.trim());
          break;
        case 'number':
          settingValue = Number(data.value);
          break;
        case 'select': {
          const options = this.settings[key] as string[] ?? [];
          if (options.includes(data.value)) {
            options.splice(options.indexOf(data.value), 1);
          } else {
            options.push(data.value);
          }
          settingValue = options;
          break;
        }
      }
    }

    this.settings[key] = settingValue as never;
    this.onChangeEmitter.fire(this.settings);
    this.triggerRender();
  }

  private getSettingFromConfig(key: keyof RequestSettings): boolean {
    const config = workspace.getConfiguration(EXTENSION_PREFIX);
    const value = config.get<boolean>(key, true);

    return value;
  }

  private async getWebViewHtml(): Promise<string> {
    const context = await runCommand('getContext');

    const styleGlobalUri = this.panel.webview.asWebviewUri(Uri.joinPath(context.extensionUri, 'web', 'global.css'));
    const styleVSCodeUri = this.panel.webview.asWebviewUri(Uri.joinPath(context.extensionUri, 'web', 'vscode.css'));
    const styleSettingsView = this.panel.webview.asWebviewUri(Uri.joinPath(context.extensionUri, 'web', 'settingsView.css'));
    const scriptUri = this.panel.webview.asWebviewUri(Uri.joinPath(context.extensionUri, 'web', 'requestSettings.js'));

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
        <link href="${styleSettingsView}" rel="stylesheet">

        <script src="${scriptUri}" nonce="${nonce}"></script>

        <title>${this.panel.title}</title>
      </head>
      <body>
      </body>
      </html>
    `;
  }
}
