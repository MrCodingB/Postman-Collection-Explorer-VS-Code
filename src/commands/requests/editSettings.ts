import { save } from '../../utils';
import { PostmanItemModel } from '../../views/postmanItems/postmanItemModel';
import { RequestSettingsView } from '../../views/requestSettingsView/requestSettingsView';

export function editSettings(item?: PostmanItemModel): void {
  if (item === undefined || !item.isRequest()) {
    return;
  }

  const object = item.itemObject;

  new RequestSettingsView(object.settings ?? {}, `${object.name} Settings`)
    .onChange((e) => {
      object.settings = e;
      save(object);
    });
}
