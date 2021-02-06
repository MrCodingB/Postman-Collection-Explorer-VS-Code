import { Header, HeaderList } from 'postman-collection';
import { getCollection, saveCollection } from '../../utils';
import { PostmanItemModel } from '../../views/postmanItems/postmanItemModel';
import { TableView } from '../../views/tableView/tableView';

export async function editHeaders(item?: PostmanItemModel): Promise<void> {
  if (item === undefined || !item.isRequest()) {
    return;
  }

  const request = item.itemObject;
  new TableView(request.headers.all(), `${request.name} Headers`).onChange((d) => {
    request.headers = new HeaderList(request, d.map((h) => new Header(h)));
    saveCollection(getCollection(request));
  });
}
