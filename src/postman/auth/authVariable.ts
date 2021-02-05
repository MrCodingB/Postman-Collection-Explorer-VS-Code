export interface AuthVariable {
  type: 'string' | 'boolean';
  userHint: string;
  optional: boolean;
  options?: string[];
  value?: string | boolean;

  setValueFromUserInput(): Promise<void>;
}
