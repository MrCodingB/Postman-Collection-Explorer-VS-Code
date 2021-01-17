import { NewmanRunOptions, run } from 'newman';
import { workspace } from 'vscode';
import { RunSummary } from '../postman/newmanTypes';

export async function runWithNewman(options: NewmanRunOptions): Promise<[Error | null, RunSummary]> {
  return new Promise<[Error | null, RunSummary]>((resolve) => {
    const workingDir = workspace.workspaceFolders ? workspace.workspaceFolders[0].uri.fsPath : undefined;

    run({ workingDir, ...options }, (err, summary) => resolve([err, summary]));
  });
}
