import { NewmanRunExecutionAssertionError, NewmanRunFailure, NewmanRunStat } from 'newman';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface RunSummary {
  error?: any;
  collection: RunCollection;
  environment: RunEnvironment;
  globals: RunGlobals;
  run: Run;
}

export interface RunCollection {
  id: string;
  item: RunCollectionItem[];
  event: any[];
  variable: RunCollectionVariable[];
  info: RunCollectionInfo;
}

export interface RunCollectionItem {
  id: string;
  name: string;
  request: RunCollectionItemRequest;
}
export interface RunCollectionItemRequest {
  url: RunCollectionItemRequestUrl;
  method: string;
}
export interface RunCollectionItemRequestUrl {
  path: string[];
  host: string[];
  query: any[];
  variable: any[];
}

export interface RunCollectionVariable {
  type: string;
  value: string;
  key: string;
}

export interface RunCollectionInfo {
  name: string;
  schema: string;
}

export interface RunEnvironment {
  id: string;
  values: any[];
}

export interface RunGlobals {
  id: string;
  values: any[];
}

export interface Run {
  stats: {
    iterations: NewmanRunStat;
    items: NewmanRunStat;
    scripts: NewmanRunStat;
    prerequests: NewmanRunStat;
    requests: NewmanRunStat;
    tests: NewmanRunStat;
    assertions: NewmanRunStat;
    testScripts: NewmanRunStat;
    prerequestScripts: NewmanRunStat;
  };
  failures: NewmanRunFailure[];
  executions: RunExecution[];
}
export interface RunExecution {
  item: RunExecutionItem;
  assertions?: RunExecutionAssertion[];
}
export interface RunExecutionItem {
  id: string;
  name: string;
}
export interface RunExecutionAssertion {
  assertion: string;
  skipped: boolean;
  error?: NewmanRunExecutionAssertionError;
}
