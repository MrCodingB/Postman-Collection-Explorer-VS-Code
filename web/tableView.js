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
    const [_, key, type] = ev.target.id.match(/^in-(.+)-(disabled|key|value|description)$/);
    changeVariable(key, type, type === "disabled" ? !ev.target.checked : ev.target.value);
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
  data.forEach((v) => {
    if (!v.key) {
      data.splice(data.indexOf(v), 1);
      return;
    }

    append(tableDiv, [
      createInputDiv(1, v, "disabled"),
      createInputDiv(2, v, "key"),
      createInputDiv(3, v, "value"),
      createInputDiv(4, v, "description")
    ])
  });
}

function addEmptyLine(tableDiv) {
  const emtpyDiv = document.createElement("div");
  emtpyDiv.classList.add("tr", "td", "col-1", "small");

  const value = createInputDiv(3, {}, "value");
  value.classList.add("disabled");

  const description = createInputDiv(4, {}, "description");
  description.classList.add("disabled");

  append(tableDiv, [emtpyDiv, createInputDiv(2, {}, "key"), value, description]);
}

function createInputDiv(colIndex, variable, type) {
  const div = document.createElement("div");
  div.classList.add("tr", "td", `col-${colIndex}`);

  const input = document.createElement("input");
  input.id = `in-${variable.key}-${type}`;

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

function changeVariable(key, variableKey, value) {
  const v = data.find((v) => v.key === key);
  if (v !== undefined) {
    if (variableKey === 'key' && !value) {
      data.splice(data.indexOf(v), 1);
    } else {
      v[variableKey] = value;
    }
  } else {
    data.push({ key, [variableKey]: value });
  }

  renderTable();
  vscode.postMessage({ type: "dataChanged", data });
}

vscode.postMessage({ type: "requestInitialData" });
