import { accessSync, readFileSync } from 'fs';
import { join } from 'path';
import { TreeDataProvider, TreeItem, TreeItemCollapsibleState, window } from 'vscode';
import { Item } from './item';

export class ItemsProvider implements TreeDataProvider<Item> {
  constructor(private workspaceRoot: string) { }

  getTreeItem(element: Item): TreeItem {
    return element;
  }

  getChildren(element?: Item): Thenable<Item[]> {
    if (!this.workspaceRoot) {
      window.showInformationMessage('No item in empty workspace');
      return Promise.resolve([]);
    }

    if (element) {
      return Promise.resolve(
        this.getDepsInPackageJson(
          join(this.workspaceRoot, 'node_modules', element.label, 'package.json')
        )
      );
    } else {
      const packageJsonPath = join(this.workspaceRoot, 'package.json');
      if (this.pathExists(packageJsonPath)) {
        return Promise.resolve(this.getDepsInPackageJson(packageJsonPath));
      } else {
        window.showInformationMessage('Workspace has no package.json');
        return Promise.resolve([]);
      }
    }
  }

  private getDepsInPackageJson(packageJsonPath: string): Item[] {
    if (this.pathExists(packageJsonPath)) {
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

      const toDep = (moduleName: string, version: string): Item => {
        if (this.pathExists(join(this.workspaceRoot, 'node_modules', moduleName))) {
          return new Item(
            moduleName,
            version,
            TreeItemCollapsibleState.Collapsed
          );
        } else {
          return new Item(moduleName, version, TreeItemCollapsibleState.None);
        }
      };

      const deps = packageJson.dependencies
        ? Object.keys(packageJson.dependencies).map((dep) =>
          toDep(dep, packageJson.dependencies[dep])
        )
        : [];
      const devDeps = packageJson.devDependencies
        ? Object.keys(packageJson.devDependencies).map((dep) =>
          toDep(dep, packageJson.devDependencies[dep])
        )
        : [];
      return deps.concat(devDeps);
    } else {
      return [];
    }
  }

  private pathExists(p: string): boolean {
    try {
      accessSync(p);
    } catch (err) {
      return false;
    }
    return true;
  }
}
