import Spreadsheet from "./spreadsheet";

export default class KintoneToSpreadsheet {
  spreadsheetId: string;
  sheetName: string;
  serviceAccountClientEmail: string;
  serviceAccountPrivateKey: string;

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

  async exec() {
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
        console.log(spreadsheet.sheet);
        console.log("OK");
      });
  }
}
