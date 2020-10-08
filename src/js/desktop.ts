import {
  Button,
  NotifyPopup,
  Spinner,
} from "@kintone/kintone-ui-component/esm/js";
import { DEFAULT_BUTTON_LABEL } from "./constants";
import KintoneToSpreadsheet from "./kintoneToSpreadsheet";

// @ts-expect-error
const PLUGIN_ID = kintone.$PLUGIN_ID;

kintone.events.on("app.record.index.show", () => {
  const config = kintone.plugin.app.getConfig(PLUGIN_ID);

  const bodyElement = document.getElementsByTagName("BODY")[0];
  const spinner = new Spinner();
  bodyElement.appendChild(spinner.render());

  const menuSpaceElement = kintone.app.getHeaderMenuSpaceElement()!;
  const buttonLabel = config.buttonLabel || DEFAULT_BUTTON_LABEL;
  const button = new Button({ text: buttonLabel, type: "submit" });
  menuSpaceElement.appendChild(button.render());
  button.on("click", () => onClickButton());

  /** NotifyPopup を表示 */
  const showPopup = (text: string, type?: "error" | "success" | "info") => {
    const popup = new NotifyPopup({
      text: text,
      type: type,
    });
    bodyElement.appendChild(popup.render());
  };

  /** 「スプシに出力」ボタンが押された際の処理 */
  const onClickButton = () => {
    const kintoneToSpreadsheet = new KintoneToSpreadsheet({
      spreadsheetId: config.spreadsheetId,
      sheetName: config.sheetName,
      serviceAccountClientEmail: config.serviceAccountClientEmail,
      serviceAccountPrivateKey: config.serviceAccountPrivateKey,
      fieldCodeList: config.fieldCodeList,
    });

    spinner.show();
    kintoneToSpreadsheet
      .exec()
      .then(() => {
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${config.spreadsheetId}/`;
        showPopup(
          `処理が完了しました<br><a href="${sheetUrl}" target="_blank">${sheetUrl}</a>`,
          "success"
        );
      })
      .catch((err) => {
        showPopup(`処理が途中で失敗しました<br>${err}`);
      })
      .finally(() => {
        spinner.hide();
      });
  };
});
