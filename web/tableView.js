/* eslint-disable */
let data = [];

const vscode = acquireVsCodeApi();

const append = (element, items) => items.forEach((i) => element.appendChild(i));

window.addEventListener("message", (ev) => {
  if (ev.data.type === "initialData") {
    data = ev.data.data;
    renderTable();
  }
});

function renderTable() {
  const tableDiv = document.createElement("div");
  tableDiv.classList.add("table");

  placeHeaders(tableDiv);
  addInputs(tableDiv);
  addEmptyLine(tableDiv);

  document.body.innerHTML = tableDiv.outerHTML;

  document.querySelectorAll("div.table input").forEach((i) => (i.onchange = (ev) => {
    const [_, index, type] = ev.target.id.match(/^in-(\d+)-(disabled|key|value|description)$/);
    changeVariable(index, type, type === "disabled" ? !ev.target.checked : ev.target.value);
  }));
}

function placeHeaders(tableDiv) {
  tableDiv.innerHTML = /* html */`
    <div class="th small"></div>
    <div class="th">Key</div>
    <div class="th">Value</div>
    <div class="th">Description</div>
  `;
}

function addInputs(tableDiv) {
  data.forEach((v, i) => {
    append(tableDiv, [
      createInputDiv(i, v, "disabled"),
      createInputDiv(i, v, "key"),
      createInputDiv(i, v, "value"),
      createInputDiv(i, v, "description")
    ])
  });
}

function addEmptyLine(tableDiv) {
  const emtpyDiv = document.createElement("div");
  emtpyDiv.classList.add("tr", "td", "col-1", "small");

  const key = createInputDiv(data.length, {}, "key");

  const value = createInputDiv(data.length, {}, "value");
  value.classList.add("disabled");

  const description = createInputDiv(data.length, {}, "description");
  description.classList.add("disabled");

  append(tableDiv, [emtpyDiv, key, value, description]);
}

function createInputDiv(index, variable, type) {
  const colIndex = type === 'disabled' ? 1 : type === 'key' ? 2 : type === 'value' ? 3 : 4;

  const div = document.createElement("div");
  div.classList.add("tr", "td", `col-${colIndex}`);

  const input = document.createElement("input");
  input.id = `in-${index}-${type}`;

  if (type === "disabled") {
    div.classList.add("small");
    input.type = "checkbox";

    if (!variable.disabled) {
      input.setAttribute("checked", true);
    }
  } else {
    input.setAttribute("value", variable[type] ?? "");
    input.setAttribute("placeholder", type);
  }

  div.appendChild(input);

  return div;
}

function changeVariable(index, variableKey, value) {
  if (index >= data.length) {
    data.push({ [variableKey]: value });
  } else {
    data[index][variableKey] = value;
  }

  data = data.map((d) => ({...d, type: 'string'}));

  renderTable();
  vscode.postMessage({ type: "dataChanged", data });
}

vscode.postMessage({ type: "requestInitialData" });
