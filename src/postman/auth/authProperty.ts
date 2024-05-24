import { VariableDefinition } from 'postman-collection';
import { AuthVariable } from './authVariable';

export class AuthProperty<V extends Record<string, AuthVariable> = Record<string, AuthVariable>> {
  constructor(public variables: V) { }

  async setVariablesFromUserInput(): Promise<void> {
    const keys = Object.keys(this.variables) as (keyof V)[];
    for (const key of keys) {
      /* eslint-disable-next-line */
      await this.variables[key].setValueFromUserInput();
    }
  }

  hasInvalidVariable(): boolean {
    let hasInvalidVariable = false;

    const keys = Object.keys(this.variables) as (keyof V)[];
    for (const key of keys) {
      if (hasInvalidVariable) {
        return hasInvalidVariable;
      }

      const variable = this.variables[key];
      hasInvalidVariable = variable === undefined || (variable.value === undefined && !variable.optional);
    }

    return hasInvalidVariable;
  }

  toDefinition(): VariableDefinition[] | undefined {
    const result: VariableDefinition[] = [];

    const keys = Object.keys(this.variables) as (keyof V)[];
    keys.forEach((k) => {
      const v = this.variables[k];

      if (v !== undefined) {
        result.push({ key: k as string, type: v.type, value: v.value });
      }
    });

    return result;
  }
}
