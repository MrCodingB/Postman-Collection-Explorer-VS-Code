import { window } from 'vscode';
import { AuthVariable } from './authVariable';

export class AuthBooleanVar implements AuthVariable {
  type = 'boolean' as const;
  optional = false;
  value?: boolean;

  constructor(public userHint: string) { }

  async setValueFromUserInput(): Promise<void> {
    const input = await window.showQuickPick(
      ['Yes', 'No'],
      { canPickMany: false, placeHolder: this.userHint }
    );

    if (input !== undefined) {
      this.value = input === 'Yes';
    }
  }
}
