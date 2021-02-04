/* eslint-disable */
const vscode = acquireVsCodeApi();

window.addEventListener("load", () => addEventListeners());

window.addEventListener("message", (ev) => {
  if (ev.data.type === "reload") {
    document.body.innerHTML = ev.data.body;

    addEventListeners();
  }
});

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
