import { PropertyList, QueryParam, VariableDefinition } from 'postman-collection';
import { save } from '../../utils';
import { PostmanItemModel } from '../../views/postmanItems/postmanItemModel';
import { TableView } from '../../views/tableView/tableView';

export async function editParameters(item?: PostmanItemModel): Promise<void> {
  if (item === undefined || !item.isRequest()) {
    return;
  }

  const request = item.itemObject;

  const parameters = request.url.query.all().map((q) => ({...q, key: q.key ?? undefined }));
  new TableView(parameters, `${request.name} QueryParams`).onChange((q) => {
    const query = (q
      .filter((v) => v.value !== undefined) as (VariableDefinition & { value: unknown })[])
      .map((v) => new QueryParam({ ...v, key: v.key ?? null }));

    request.url.query = new PropertyList(QueryParam as never, request.url, query);
    save(request);
  });
}
