import { join } from 'path';
import { Uri, workspace } from 'vscode';
import { PREREQEUST_TYPES } from './script-types/prerequest-types';
import { TEST_TYPES } from './script-types/test-types';

const TSCONFIG = `{
	"compilerOptions": {
		"module": "commonjs",
		"target": "es6",
		"lib": [
			"es6"
		],
    "charset": "utf-8",
    "newLine": "lf",
	}
}`;

export async function ensureTypingsInStorageLocation(folder: Uri, type: 'prerequest' | 'test'): Promise<void> {
  const typingsText = type === 'prerequest' ? PREREQEUST_TYPES : TEST_TYPES;

  await workspace.fs.writeFile(Uri.file(join(folder.fsPath, 'tsconfig.json')), Buffer.from(TSCONFIG));

  await workspace.fs.writeFile(Uri.file(join(folder.fsPath, 'index.d.ts')), Buffer.from(typingsText));
}
