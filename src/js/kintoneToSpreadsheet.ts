import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import Spreadsheet from "./spreadsheet";

export default class KintoneToSpreadsheet {
  spreadsheetId: string;
  sheetName: string;
  serviceAccountClientEmail: string;
  serviceAccountPrivateKey: string;

  headerKeys?: string[];
  allRecordsArray?: string[][];

  constructor({
    spreadsheetId,
    sheetName = "kintone連携",
    serviceAccountClientEmail,
    serviceAccountPrivateKey,
  }: {
    spreadsheetId: string;
    sheetName?: string;
    serviceAccountClientEmail: string;
    serviceAccountPrivateKey: string;
  }) {
    this.spreadsheetId = spreadsheetId;
    this.sheetName = sheetName;
    this.serviceAccountClientEmail = serviceAccountClientEmail;
    this.serviceAccountPrivateKey = serviceAccountPrivateKey;
  }

  /** kintoneアプリの全レコードを取得し、 this.allRecordsArray に格納 */
  async getAllRecords() {
    const kintoneClient = new KintoneRestAPIClient();
    const allRecords = await kintoneClient.record.getAllRecords({
      app: kintone.app.getId()!,
      orderBy: "更新日時 desc",
    });
    console.log(allRecords);

    let keys = Object.keys(allRecords[0]);
    keys = keys.filter(
      (key) =>
        ![
          "$revision",
          "$id",
          "作成者",
          "作成日時",
          "更新者",
          "活動履歴",
        ].includes(key)
    );
    keys.sort();
    console.log(keys);

    this.headerKeys = keys;

    this.allRecordsArray = [];
    allRecords.forEach((record) => {
      const rowArray: string[] = [];
      keys.forEach((key) => {
        if (record[key].value == null) {
          rowArray.push("");
        } else {
          rowArray.push(record[key].value!.toString());
        }
      });

      this.allRecordsArray!.push(rowArray);
    });

    console.log(this.allRecordsArray);
  }

  /** kintoneデータをGoogleスプレッドシートに出力するメイン処理 */
  async exec() {
    await this.getAllRecords();

    const spreadsheet = new Spreadsheet({
      spreadsheetId: this.spreadsheetId,
      serviceAccountClientEmail: this.serviceAccountClientEmail,
      serviceAccountPrivateKey: this.serviceAccountPrivateKey,
    });

    await spreadsheet
      .initDoc()
      .then(() => {
        return spreadsheet.initSheet(this.sheetName);
      })
      .then(() => {
        return spreadsheet.setValues(this.headerKeys!, this.allRecordsArray!);
      })
      .then(() => {
        console.log("OK");
      });
  }
}
