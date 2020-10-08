import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import Spreadsheet from "./spreadsheet";

export default class KintoneToSpreadsheet {
  spreadsheetId: string;
  sheetName: string;
  serviceAccountClientEmail: string;
  serviceAccountPrivateKey: string;
  fieldCodeList: string;

  headerKeys?: string[];
  allRecordsArray?: string[][];

  constructor({
    spreadsheetId,
    sheetName = "",
    serviceAccountClientEmail,
    serviceAccountPrivateKey,
    fieldCodeList = "",
  }: {
    spreadsheetId: string;
    sheetName?: string;
    serviceAccountClientEmail: string;
    serviceAccountPrivateKey: string;
    fieldCodeList?: string;
  }) {
    this.spreadsheetId = spreadsheetId;
    this.sheetName = sheetName === "" ? "kintone連携" : sheetName;
    this.serviceAccountClientEmail = serviceAccountClientEmail;
    this.serviceAccountPrivateKey = serviceAccountPrivateKey;
    this.fieldCodeList = fieldCodeList;
  }

  /** kintoneアプリの全レコードを取得し、 this.allRecordsArray に格納 */
  async getAllRecords() {
    const kintoneClient = new KintoneRestAPIClient();
    const allRecords = await kintoneClient.record.getAllRecords({
      app: kintone.app.getId()!,
      orderBy: "更新日時 desc",
    });
    // console.log(allRecords); // デバッグ用

    this.setHeaderKeys(allRecords[0]);
    if (this.headerKeys == null || this.headerKeys.length === 0) {
      return Promise.reject(
        new Error(
          "出力できる列が存在しません。プラグイン設定『出力する列の指定』を見直してください"
        )
      );
    }

    this.allRecordsArray = [];
    allRecords.forEach((record) => {
      const rowArray: string[] = [];
      this.headerKeys!.forEach((key) => {
        rowArray.push(this.parseData(record[key]));
      });

      this.allRecordsArray!.push(rowArray);
    });

    return Promise.resolve();
  }

  /**
   * スプレッドシートに出力する列名の一覧を設定する。
   * fieldCodeList がプラグイン設定にて設定されていない場合は、ほぼ全てのフィールドコードを選択
   * @param record レコード1件。フィールドコードの一覧を取得するために使用
   */
  setHeaderKeys(record: any) {
    const recordKeys = Object.keys(record);
    let fieldCodes: string[] = [];

    if (this.fieldCodeList === "") {
      fieldCodes = recordKeys.filter(
        (recordKey) =>
          ![
            "$revision",
            "$id",
            "作成者",
            "作成日時",
            "更新者",
            "更新日時",
            "活動履歴",
          ].includes(recordKey)
      );
      fieldCodes.sort();
      fieldCodes.push("作成日時");
      fieldCodes.push("更新日時");
    } else {
      fieldCodes = this.fieldCodeList.split(/[,|、]/);
      fieldCodes = fieldCodes.map((fieldCode) => fieldCode.trim());
      fieldCodes = fieldCodes.filter((fieldCode) => fieldCode !== "");
      fieldCodes.forEach((fieldCode) => {
        if (!recordKeys.includes(fieldCode)) {
          throw new Error(
            `フィールドコード「${fieldCode}」は存在しません。プラグイン設定『出力する列の指定』を見直してください`
          );
        }
      });
    }

    this.headerKeys = fieldCodes;
  }

  /**
   * セルに値が出力されるようパース
   * @TODO data.type の対応はよく使うものに絞っているので、必要に応じて増やす必要アリ
   */
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
      });
  }
}
