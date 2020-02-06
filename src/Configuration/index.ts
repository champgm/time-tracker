import { googleToken } from "./GoogleToken";
import { spreadsheet } from "./Spreadsheet";
import { SpreadsheetConfiguration } from "./SpreadsheetConfiguration";
import { GoogleTokenConfiguration } from "./GoogleTokenConfiguration";

export interface Configuration {
  spreadsheet: SpreadsheetConfiguration
  googleAuth: {
    sheetsEndpoint: string,
    tokenEndpoint: string,
    tokenRequestBody: GoogleTokenConfiguration
  };
}

export const configuration: Configuration = {
  spreadsheet,
  googleAuth: {
    sheetsEndpoint: "https://sheets.googleapis.com/v4/spreadsheets",
    tokenEndpoint: "https://www.googleapis.com/oauth2/v4/token",
    tokenRequestBody: googleToken,
  },
};
