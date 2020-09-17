// You can use the ESModules syntax and @kintone/rest-api-client without additional settings.
// import { KintoneRestAPIClient } from "@kintone/rest-api-client";

// @ts-expect-error
const PLUGIN_ID = kintone.$PLUGIN_ID;

const form = document.querySelector(".js-submit-settings")!;
const cancelButton = document.querySelector(".js-cancel-button")!;
const buttonLabelInput = document.querySelector<HTMLInputElement>(
  ".js-text-button-label"
)!;
const config = kintone.plugin.app.getConfig(PLUGIN_ID);

if (config.buttonLabel) {
  buttonLabelInput.value = config.buttonLabel;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  kintone.plugin.app.setConfig({ buttonLabel: buttonLabelInput.value }, () => {
    alert("プラグイン設定の更新を完了するには「アプリを更新」を押してください");
    window.location.href = "../../flow?app=" + kintone.app.getId();
  });
});
cancelButton.addEventListener("click", () => {
  window.location.href = "../../" + kintone.app.getId() + "/plugin/";
});
