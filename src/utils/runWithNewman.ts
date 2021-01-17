import { NewmanRunOptions, NewmanRunSummary, run } from 'newman';
import { workspace } from 'vscode';

export async function runWithNewman(options: NewmanRunOptions): Promise<[Error | null, NewmanRunSummary]> {
  return new Promise<[Error | null, NewmanRunSummary]>((resolve) => {
    const workingDir = workspace.workspaceFolders ? workspace.workspaceFolders[0].uri.fsPath : undefined;

    run({ workingDir, ...options }, (err, summary) => resolve([err, summary]));
  });
}
