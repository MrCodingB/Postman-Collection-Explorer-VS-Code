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
        this.panel.webview.postMessage({ type: 'initialData', data: this.settings });
      }
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
    this.panel.webview.postMessage({ type: 'reload', body: this.getSettingsList() });
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
        ${this.getSettingsList()}
      </body>
      </html>
    `;
  }

  private getSettingsList(): string {
    return REQUEST_SETTINGS
      .map((s) => this.getSettingDiv(s))
      .join('\n');
  }

  private getSettingDiv(setting: typeof REQUEST_SETTINGS[0]): string {
    return /* html */`
      <div class="col col-1">
        <span class="title">${setting.title}</span>
        <span class="description">${setting.description}</span>
      </div>
      <div class="col col-2">
        ${this.getInput(setting.type, this.settings[setting.key], setting.key)}
      </div>
    `;
  }

  private getInput<
    K extends keyof RequestSettings = keyof RequestSettings,
    V extends RequestSettings[K] = RequestSettings[K]
  >(type: string, value: V, key: K): string {
    let input = '';

    const setting = REQUEST_SETTINGS.find((s) => s.key === key);
    if (setting === undefined) {
      return '';
    }

    const defaultValue = setting.default === 'settings' ? this.getSettingFromConfig(key) : setting.default;

    switch (type) {
      case 'boolean':
        input = /* html */`
          <label class="switch">
            <input type="checkbox" id="${key}" ${(value ?? defaultValue) ? 'checked' : ''}>
            <span class="slider"></span>
          </label>
        `;
        break;
      case 'number':
        input = /* html */`<input id=${key} type="number" min="0" max="10000000" step="1" value="${value ?? defaultValue}">`;
        break;
      case 'select':
        input = setting.options
          ?.map((o) => /* html */`
            <label>
              <input type="checkbox" id="${key}" name="${o}" value="${o}" ${(this.settings[key] as unknown[])?.includes(o) ? 'checked' : ''}>
              ${o}
            </label>
          `)
          .join('\n') ?? '';
        break;
      case 'array':
        input = /* html */`<input id=${key} value="${((value ?? defaultValue) as never[]).join(', ')}">`;
        break;
    }

    if (value !== undefined) {
      input += /* html */`<span class="restore" id="${key}.default">Restore default</span>`;
    }

    return input;
  }
}
