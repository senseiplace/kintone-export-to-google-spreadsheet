import {
  GoogleSpreadsheet,
  GoogleSpreadsheetWorksheet,
} from "google-spreadsheet";

export default class Spreadsheet {
  spreadsheetId: string;
  serviceAccountClientEmail: string;
  serviceAccountPrivateKey: string;
  doc?: GoogleSpreadsheet;
  sheet?: GoogleSpreadsheetWorksheet;

  constructor({
    spreadsheetId,
    serviceAccountClientEmail,
    serviceAccountPrivateKey,
  }: {
    spreadsheetId: string;
    serviceAccountClientEmail: string;
    serviceAccountPrivateKey: string;
  }) {
    this.spreadsheetId = spreadsheetId;
    this.serviceAccountClientEmail = serviceAccountClientEmail;
    this.serviceAccountPrivateKey = serviceAccountPrivateKey;
  }

  /** spreadsheetId からスプレッドシートを探し doc を初期化 */
  async initDoc() {
    this.doc = new GoogleSpreadsheet(this.spreadsheetId);
    // \n が文字列として格納されているので、改行記号へと直す
    const privateKeyWithNewLine = this.serviceAccountPrivateKey
      .split(/\\n/)
      .join("\n");

    await this.doc!.useServiceAccountAuth({
      client_email: this.serviceAccountClientEmail,
      private_key: privateKeyWithNewLine,
    });
    await this.doc!.loadInfo();
  }

  /** sheetName でスプレッドシート内を探し sheet を初期化。無ければ作成 */
  async initSheet(sheetName: string) {
    this.sheet = this.doc!.sheetsByTitle[sheetName];

    if (this.sheet == null) {
      this.sheet = await this.doc!.addSheet({ title: sheetName });
    }
  }

  /** 既存データを削除してからヘッダーとデータを挿入 */
  async setValues(headerKeys: string[], records: string[][]) {
    await this.sheet!.clear();
    await this.sheet!.setHeaderRow(headerKeys);
    await this.sheet!.addRows(records);
  }
}
