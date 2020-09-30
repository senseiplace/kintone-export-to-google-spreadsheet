// @ts-expect-error
const PLUGIN_ID = kintone.$PLUGIN_ID;

const form = document.querySelector(".js-submit-settings")!;
const cancelButton = document.querySelector(".js-cancel-button")!;
const spreadsheetIdInput = document.querySelector<HTMLInputElement>(
  "#spreadsheetId"
)!;
const serviceAccountClientEmailInput = document.querySelector<HTMLInputElement>(
  "#serviceAccountClientEmail"
)!;
const serviceAccountPrivateKeyInput = document.querySelector<HTMLInputElement>(
  "#serviceAccountPrivateKey"
)!;
const sheetNameInput = document.querySelector<HTMLInputElement>("#sheetName")!;
const fieldCodeListInput = document.querySelector<HTMLInputElement>(
  "#fieldCodeList"
)!;
const buttonLabelInput = document.querySelector<HTMLInputElement>(
  "#buttonLabel"
)!;
const config = kintone.plugin.app.getConfig(PLUGIN_ID);

function initFieldValues() {
  spreadsheetIdInput.value = config.spreadsheetId || "";
  serviceAccountClientEmailInput.value = config.serviceAccountClientEmail || "";
  serviceAccountPrivateKeyInput.value = config.serviceAccountPrivateKey || "";
  sheetNameInput.value = config.sheetName || "";
  fieldCodeListInput.value = config.fieldCodeList || "";
  buttonLabelInput.value = config.buttonLabel || "";
}

initFieldValues();

form.addEventListener("submit", (e) => {
  e.preventDefault();
  kintone.plugin.app.setConfig(
    {
      spreadsheetId: spreadsheetIdInput.value,
      serviceAccountClientEmail: serviceAccountClientEmailInput.value,
      serviceAccountPrivateKey: serviceAccountPrivateKeyInput.value,
      sheetName: sheetNameInput.value,
      fieldCodeList: fieldCodeListInput.value,
      buttonLabel: buttonLabelInput.value,
    },
    () => {
      alert(
        "プラグイン設定の更新を完了するには「アプリを更新」を押してください"
      );
      window.location.href = "../../flow?app=" + kintone.app.getId();
    }
  );
});

cancelButton.addEventListener("click", () => {
  window.location.href = "../../" + kintone.app.getId() + "/plugin/";
});
