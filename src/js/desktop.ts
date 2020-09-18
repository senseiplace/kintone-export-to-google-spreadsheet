// You can use the ESModules syntax and @kintone/rest-api-client without additional settings.
// import { KintoneRestAPIClient } from "@kintone/rest-api-client";

import { Alert, Button } from "@kintone/kintone-ui-component/esm/js";
import Spreadsheet from "./spreadsheet";

// @ts-expect-error
const PLUGIN_ID = kintone.$PLUGIN_ID;

kintone.events.on("app.record.index.show", () => {
  let alert: Alert | null = null;
  const config = kintone.plugin.app.getConfig(PLUGIN_ID);

  const spaceElement = kintone.app.getHeaderSpaceElement()!;
  const menuSpaceElement = kintone.app.getHeaderMenuSpaceElement()!;
  const buttonLabel = config.buttonLabel || "スプシに出力";
  const button = new Button({ text: buttonLabel, type: "submit" });
  menuSpaceElement.appendChild(button.render());

  const addSheet = (sheetName: string) => {
    const spreadsheet = new Spreadsheet(
      config.spreadsheetId,
      config.serviceAccountClientEmail,
      config.serviceAccountPrivateKey
    );

    spreadsheet
      .initDoc()
      .then(() => {
        return spreadsheet.addSheet(sheetName);
      })
      .then(() => {
        console.log("OK");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  button.on("click", function () {
    if (alert === null) {
      alert = new Alert({
        text: "ボタンが押されたよ！",
        type: "success",
      });
      alert.on("click", () => {
        alert!.hide();
        alert = null;
      });
      spaceElement.appendChild(alert.render());
      alert.show();

      addSheet("test");
    }
  });
});
