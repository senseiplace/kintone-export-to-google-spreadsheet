// You can use the ESModules syntax and @kintone/rest-api-client without additional settings.
// import { KintoneRestAPIClient } from "@kintone/rest-api-client";

import {
  Button,
  NotifyPopup,
  Spinner,
} from "@kintone/kintone-ui-component/esm/js";
import Spreadsheet from "./spreadsheet";

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
  button.on("click", function () {
    addSheet("test");
  });

  const showPopup = (text: string, type?: "error" | "success" | "info") => {
    const popup = new NotifyPopup({
      text: text,
      type: type,
    });
    bodyElement.appendChild(popup.render());
  };

  const addSheet = (sheetName: string) => {
    const spreadsheet = new Spreadsheet(
      config.spreadsheetId,
      config.serviceAccountClientEmail,
      config.serviceAccountPrivateKey
    );

    spinner.show();
    spreadsheet
      .initDoc()
      .then(() => {
        return spreadsheet.addSheet(sheetName);
      })
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
