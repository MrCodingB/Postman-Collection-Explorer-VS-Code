import { NewmanRunOptions, NewmanRunSummary, run } from 'newman';

export async function runWithNewman(options: NewmanRunOptions): Promise<[Error | null, NewmanRunSummary]> {
  return new Promise<[Error | null, NewmanRunSummary]>((resolve) => {
    run(options, (err, summary) => resolve([err, summary]));
  });
}
