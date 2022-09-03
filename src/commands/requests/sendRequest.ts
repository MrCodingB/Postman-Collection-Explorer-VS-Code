import { window, workspace } from 'vscode';
import { RunExecutionResponse } from '../../postman';
import { getCollection, runWithNewman } from '../../utils';
import { PostmanItemModel } from '../../views/postmanItems/postmanItemModel';

interface OrderedResponse {
  code: number;
  status: string;
  responseTimeInMs: number;
  responseSizeInB: number;
  cookies: unknown[];
  headers: unknown[];
  body: string;
}

function toOrderedResponse(res?: RunExecutionResponse): OrderedResponse | undefined {
  if (res === undefined) {
    return undefined;
  }

  return {
    code: res.code,
    status: res.status,
    responseTimeInMs: res.responseTime,
    responseSizeInB: res.responseSize,
    cookies: res.cookie,
    headers: res.header,
    body: Buffer.from(res.stream.data).toString()
  };
}

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

  let executions = summary[1].run.executions;
  if (executions.length === 0) {
    return;
  } else if (executions.length > 1) {
    executions = executions.filter((e) => e.item.name === request.name);
  }

  const documentObject = executions.length > 1
    ? executions
      .map((e) => toOrderedResponse(e.response))
      .filter((r) => r !== undefined) as OrderedResponse[]
    : toOrderedResponse(executions[0].response);

  if (Array.isArray(documentObject) && documentObject.length <= 0 || documentObject === undefined) {
    await window.showInformationMessage(`${request.name} did not return a response`);
    return;
  }

  const document = await workspace.openTextDocument({
    language: 'json',
    content: JSON.stringify(documentObject, undefined, 2)
  });

  await window.showTextDocument(document);
}
