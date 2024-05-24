import { window } from 'vscode';
import { AuthVariable } from './authVariable';

export class AuthStringVar<V extends string = string> implements AuthVariable {
  type = 'string' as const;
  value?: V;

  constructor(
    public userHint: string,
    public optional = false,
    public options?: V[]
  ) { }

  async setValueFromUserInput(): Promise<void> {
    const userHint = `${this.userHint}${this.optional ? ' (optional)' : ''}`;

    const input = await (this.options !== undefined
      ? window.showQuickPick(this.options, { canPickMany: false, placeHolder: userHint })
      : window.showInputBox({ prompt: userHint, value: this.value, valueSelection: this.value && [0, this.value.length] })) as V | undefined;

    if (input !== undefined) {
      this.value = input;
    }
  }
}
