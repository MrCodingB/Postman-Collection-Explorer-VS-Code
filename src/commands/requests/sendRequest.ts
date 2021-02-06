import { window, workspace } from 'vscode';
import { RunExecutionResponse } from '../../postman';
import { getCollection, runWithNewman } from '../../utils';
import { PostmanItemModel } from '../../views/postmanItems/postmanItemModel';

export async function sendRequest(item?: PostmanItemModel): Promise<void> {
  if (item === undefined || !item.isRequest()) {
    return;
  }

  const request = item.itemObject;
  const summary = await runWithNewman({ collection: getCollection(request).rootItem, folder: request.id });
  if (summary[0] !== null || summary[1] === undefined) {
    console.warn(`Could not run request ${request.name}\n`, summary[0]);
    return;
  }

  const executions = summary[1].run.executions;
  if (executions.length === 0) {
    return;
  }

  let response:  RunExecutionResponse | undefined = executions[0].response;
  if (executions.length > 1) {
    const execution = executions.find((e) => e.item.name === request.name);
    response = execution?.response;
  }

  if (response === undefined) {
    return;
  }

  const orderedResponse = {
    code: response.code,
    status: response.status,
    responseTimeInMs: response.responseTime,
    responseSizeInB: response.responseSize,
    cookies: response.cookie,
    headers: response.header,
    body: Buffer.from(response.stream.data).toString()
  };

  const document = await workspace.openTextDocument({ language: 'json', content: JSON.stringify(orderedResponse, undefined, 2) });

  await window.showTextDocument(document);
}
