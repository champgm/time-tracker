import { googleToken } from "./GoogleToken";
import { spreadsheetConfiguration } from "./Spreadsheet";

export interface Configuration {
  spreadsheetId: string,
  sheetId:number,
  googleAuth: {
    sheetsEndpoint: string,
    tokenEndpoint: string,
    tokenRequestBody: {
      grant_type: string,
      refresh_token: string,
      client_id: string,
      client_secret: string,
    },
  };
}

export const configuration: Configuration = {
  ...spreadsheetConfiguration,
  googleAuth: {
    sheetsEndpoint: "https://sheets.googleapis.com/v4/spreadsheets",
    tokenEndpoint: "https://www.googleapis.com/oauth2/v4/token",
    tokenRequestBody: googleToken,
  },
};
