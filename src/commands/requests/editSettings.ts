import { getCollection, saveCollection } from '../../utils';
import { PostmanItemModel } from '../../views/postmanItems/postmanItemModel';
import { RequestSettingsView } from '../../views/requestSettingsView/requestSettingsView';

export function editSettings(item?: PostmanItemModel): void {
  if (item === undefined || !item.isRequest()) {
    return;
  }

  new RequestSettingsView(item.itemObject.settings ?? {}, `${item.itemObject.name} Settings`)
    .onChange((e) => {
      item.itemObject.settings = e;
      saveCollection(getCollection(item.itemObject));
    });
}
