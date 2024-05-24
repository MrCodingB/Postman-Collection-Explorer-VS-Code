import { NewmanRunOptions, NewmanRunSummary, run } from 'newman';
import { workspace } from 'vscode';
import { EXTENSION_PREFIX } from '../commands/commands';

export async function runWithNewman(options: NewmanRunOptions): Promise<[Error | null, NewmanRunSummary]> {
  return new Promise<[Error | null, NewmanRunSummary]>((resolve) => {
    const workingDir = workspace.workspaceFolders ? workspace.workspaceFolders[0].uri.fsPath : undefined;

    const config = workspace.getConfiguration(EXTENSION_PREFIX);
    const strictSSL = config.get<boolean>('strictSSL', true);
    const followRedirects = config.get<boolean>('followRedirects', true);

    run(
      { workingDir, insecure: !strictSSL, ignoreRedirects: !followRedirects, ...options },
      (err, summary) => resolve([err, summary])
    );
  });
}
