/* eslint-disable */
const vscode = acquireVsCodeApi();

let settings = {};
let settingInfos = [];

window.addEventListener("load", () => addEventListeners());

window.addEventListener("message", (ev) => {
  if (ev.data.type === "render") {
    settings = ev.data.settings;
    settingInfos = ev.data.settingInfos;
    render();
  }
});

function render() {
  document.body.innerHTML = settingInfos
    ?.map((s) => this.getSettingDiv(s))
    ?.join('\n') ?? '';

  addEventListeners();
}

function getSettingDiv(setting) {
  return /* html */`
    <div class="col col-1">
      <span class="title">${setting.title}</span>
      <span class="description">${setting.description}</span>
    </div>
    <div class="col col-2">
      ${this.getInput(setting.type, settings[setting.key], setting.key)}
    </div>
  `;
}

function getInput(type, value, key) {
  let input = '';

  const setting = settingInfos.find((s) => s.key === key);
  if (setting === undefined) {
    return '';
  }

  switch (type) {
    case 'boolean':
      input = /* html */`
        <label class="switch">
          <input type="checkbox" id="${key}" ${(value ?? setting.default) ? 'checked' : ''}>
          <span class="slider"></span>
        </label>
      `;
      break;
    case 'number':
      input = /* html */`<input id=${key} type="number" min="0" max="10000000" step="1" value="${value ?? setting.default}">`;
      break;
    case 'select':
      input = setting.options
        ?.map((o) => /* html */`
          <label>
            <input type="checkbox" id="${key}" name="${o}" value="${o}" ${settings[key]?.includes(o) ? 'checked' : ''}>
            ${o}
          </label>
        `)
        .join('\n') ?? '';
      break;
    case 'array':
      input = /* html */`<input id=${key} value="${(value ?? setting.default).join(', ')}">`;
      break;
  }

  if (value !== undefined) {
    input += /* html */`<span class="restore" id="${key}.default">Restore default</span>`;
  }

  return input;
}

function addEventListeners() {
  document
    .querySelectorAll("input")
    ?.forEach(
      (i) =>
        (i.onchange = (ev) =>
          changeVariable(
            ev.target.id,
            ev.target.type === "checkbox"
              ? ev.target.name
                ? ev.target.name
                : ev.target.checked
              : ev.target.value
          ))
    );

  document
    .querySelectorAll("span.restore")
    ?.forEach((d) => (d.onclick = (ev) => changeVariable(ev.target.id)));
}

function changeVariable(key, value) {
  vscode.postMessage({ type: "dataChanged", data: { key, value } });
}

vscode.postMessage({ type: 'requestInitialData' });
