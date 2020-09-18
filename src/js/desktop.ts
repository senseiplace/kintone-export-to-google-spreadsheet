import {
  Button,
  NotifyPopup,
  Spinner,
} from "@kintone/kintone-ui-component/esm/js";
import KintoneToSpreadsheet from "./kintoneToSpreadsheet";

// @ts-expect-error
const PLUGIN_ID = kintone.$PLUGIN_ID;

kintone.events.on("app.record.index.show", () => {
  const config = kintone.plugin.app.getConfig(PLUGIN_ID);

  const bodyElement = document.getElementsByTagName("BODY")[0];
  const spinner = new Spinner();
  bodyElement.appendChild(spinner.render());

  const menuSpaceElement = kintone.app.getHeaderMenuSpaceElement()!;
  const buttonLabel = config.buttonLabel || "スプシに出力";
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

  /** スプシに出力ボタンが押された際の処理 */
  const onClickButton = () => {
    const kintoneToSpreadsheet = new KintoneToSpreadsheet({
      // TODO: sheetName を config で指定できるようにするのはあとで実装
      spreadsheetId: config.spreadsheetId,
      serviceAccountClientEmail: config.serviceAccountClientEmail,
      serviceAccountPrivateKey: config.serviceAccountPrivateKey,
    });

    spinner.show();
    kintoneToSpreadsheet
      .exec()
      .then(() => {
        showPopup("処理が完了しました", "success");
      })
      .catch((err) => {
        showPopup(`処理が途中で失敗しました<br>${err}`);
      })
      .finally(() => {
        spinner.hide();
      });
  };
});
