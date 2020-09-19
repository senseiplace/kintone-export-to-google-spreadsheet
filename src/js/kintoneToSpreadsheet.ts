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
          "更新日時",
          "活動履歴",
        ].includes(key)
    );
    keys.sort();
    keys.push("作成日時");
    keys.push("更新日時");
    console.log(keys);

    this.headerKeys = keys;

    this.allRecordsArray = [];
    allRecords.forEach((record) => {
      const rowArray: string[] = [];
      keys.forEach((key) => {
        rowArray.push(this.parseData(record[key]));
      });

      this.allRecordsArray!.push(rowArray);
    });

    console.log(this.allRecordsArray);
  }

  parseData(data: any): string {
    if (data.value == null) {
      return "";
    }

    switch (data.type) {
      case "CREATOR":
      case "MODIFIER":
        return data.value.name.toString();
      case "USER_SELECT":
        const names: string[] = [];
        data.value.forEach((person: any) => {
          names.push(person.name as string);
        });
        return names.join("\n");
      case "MULTI_SELECT":
        return data.value.join("\n");
      default:
        return data.value.toString();
    }
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
