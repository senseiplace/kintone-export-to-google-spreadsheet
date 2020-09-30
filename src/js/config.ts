// You can use the ESModules syntax and @kintone/rest-api-client without additional settings.
// import { KintoneRestAPIClient } from "@kintone/rest-api-client";

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
const buttonLabelInput = document.querySelector<HTMLInputElement>(
  "#buttonLabel"
)!;
const fieldCodeListInput = document.querySelector<HTMLInputElement>(
  "#fieldCodeList"
)!;
const config = kintone.plugin.app.getConfig(PLUGIN_ID);

function initFieldValues() {
  spreadsheetIdInput.value = config.spreadsheetId || "";
  serviceAccountClientEmailInput.value = config.serviceAccountClientEmail || "";
  serviceAccountPrivateKeyInput.value = config.serviceAccountPrivateKey || "";
  sheetNameInput.value = config.sheetName || "";
  buttonLabelInput.value = config.buttonLabel || "";
  fieldCodeListInput.value = config.fieldCodeList || "";
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
      buttonLabel: buttonLabelInput.value,
      fieldCodeList: fieldCodeListInput.value,
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
