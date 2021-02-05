import { RequestAuthDefinition } from 'postman-collection';
import { AuthProperties } from './authProperties';
import { AuthProperty } from './authProperty';
import { AuthVariable } from './authVariable';

export type AuthTypes = RequestAuthDefinition['type'] & string;

export class Auth {
  properties = new AuthProperties();
  type?: AuthTypes = 'noauth';

  constructor(definition: RequestAuthDefinition) {
    this.type = definition.type;

    if (this.type === undefined || this.type === 'noauth') {
      return this;
    }

    const keys = Object.keys(this.properties) as (keyof AuthProperties)[];
    keys.forEach((k) => {
      if (k === 'noauth') {
        return;
      }

      const def = definition[k];
      if (def === undefined) {
        return;
      }

      const prop = this.properties[k];
      def.forEach((vardef) => {
        const v = prop.variables[vardef.key as keyof AuthProperty<typeof prop.variables>['variables']] as AuthVariable;
        if (v !== undefined && vardef.key !== undefined && vardef.value !== undefined) {
          v.value = vardef.value;
        }
      });
    });

    return this;
  }

  async setFromUserInput<T extends AuthTypes = AuthTypes>(authType: T): Promise<Auth | undefined> {
    const auth = this.properties[authType];

    await auth.setVariablesFromUserInput();

    if (auth.hasInvalidVariable()) {
      return;
    }

    this.type = authType;
    return this;
  }

  toDefinition(): RequestAuthDefinition {
    const result: RequestAuthDefinition = { type: this.type };

    const keys = Object.keys(this.properties) as (keyof AuthProperties)[];
    keys.forEach((k) => {
      if (k !== 'noauth' && !this.properties[k].hasInvalidVariable()) {
        result[k] = this.properties[k].toDefinition();
      }
    });

    return result;
  }
}
