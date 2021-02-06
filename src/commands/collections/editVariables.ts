import { Variable, VariableList } from 'postman-collection';
import { PostmanItemModel } from '../../views/postmanItems/postmanItemModel';
import { TableView } from '../../views/tableView/tableView';
import { save } from '../../utils/save';

export async function editVariables(item?: PostmanItemModel): Promise<void> {
  if (item === undefined || !item.isCollection()) {
    return;
  }

  const collection = item.itemObject;
  new TableView(collection.variables.all(), `${collection.name} Variables`).onChange((v) => {
    collection.variables = new VariableList(collection.variables.toJSON(), v.map((d) => new Variable(d)));
    save(collection);
  });
}
