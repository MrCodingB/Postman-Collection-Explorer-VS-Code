import { NewmanRunOptions, NewmanRunSummary, run } from 'newman';
import { workspace } from 'vscode';
import { RunSummary } from '../postman/newmanTypes';

function toRunSummary(summary: NewmanRunSummary): RunSummary {
  const result = JSON.parse(JSON.stringify(summary)) as RunSummary;

  result.collection.id = summary.collection._.postman_id;

  return result;
}

export async function runWithNewman(options: NewmanRunOptions): Promise<[Error | null, RunSummary]> {
  return new Promise<[Error | null, RunSummary]>((resolve) => {
    const workingDir = workspace.workspaceFolders ? workspace.workspaceFolders[0].uri.fsPath : undefined;

    run({ workingDir, ...options }, (err, summary) => resolve([err, toRunSummary(summary)]));
  });
}
