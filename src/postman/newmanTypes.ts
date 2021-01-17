/* eslint-disable @typescript-eslint/no-explicit-any */
import { NewmanRunSummary } from 'newman';

export interface RunSummary extends NewmanRunSummary {
  collection: RunCollection;
  environment: RunEnvironment;
  globals: RunGlobals;
}

export interface RunCollection {
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
