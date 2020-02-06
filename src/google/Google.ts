
import { Buffer } from "buffer";
import qs from "qs";
import { configuration } from "../Configuration";
import { AppendCellsRequest } from "./AppendCellsRequest";

export async function getAccessToken() {
  const parameters: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: qs.stringify({
      ...configuration.googleAuth.tokenRequestBody,
    }),
  };
  const fetchResult = await fetch(configuration.googleAuth.tokenEndpoint, parameters);
  return (await fetchResult.json()).access_token;
}

export function formatEmail(sender: string, recipient: string, subject: string, body: string) {
  return `To: ${recipient}
From: ${sender}
Subject: ${handleUnicode(subject)}

${body ? body : "."}\n`;
}

// https://github.com/googleapis/google-api-nodejs-client/issues/739
// tslint:disable-next-line:max-line-length
// https://github.com/googleapis/google-api-nodejs-client/pull/1088/files/7dd0d7770911688a5e6018d9418381be81253146#diff-ed4183b64bd56b93f40d1aaa8a7597d0
function handleUnicode(stringValue) {
  const buffer = Buffer.from(stringValue);
  const encoded = buffer.toString("base64");
  const full = `=?utf-8?B?${encoded}?=`;
  return full;
}


export async function addRow(date: Date, action: string, note: string) {
  const bearerTokenPromise = getAccessToken();
  const timestamp = date.getTime();
  const appendCellsRequest: AppendCellsRequest = {
    rows: [{
      values: [
        { userEnteredValue: { numberValue: timestamp } },
        { userEnteredValue: { stringValue: date.toLocaleString("en-US", { timeZone: "America/New_York" }) } },
        { userEnteredValue: { stringValue: action } },
        { userEnteredValue: { stringValue: note } },
      ],
    }],
    fields: '*',
    sheetId: configuration.spreadsheet.sheetId,
  }

  const authorizationHeader = `Bearer ${await bearerTokenPromise}`;
  const body = { requests: [{ appendCells: appendCellsRequest }] };
  const parameters: RequestInit = {
    method: "POST",
    headers: { authorization: authorizationHeader, },
    body: JSON.stringify(body),
  };

  const batchUpdateUrl = `${configuration.googleAuth.sheetsEndpoint}/${configuration.spreadsheet.spreadsheetId}:batchUpdate`
  console.log(`Updating sheet with URI: ${batchUpdateUrl}`);
  console.log(`Adding rows with parameters: ${JSON.stringify(parameters, null, 2)}`);
  console.log(`JSON body: ${JSON.stringify(body, null, 2)}`);

  const fetchResult = await fetch(batchUpdateUrl, parameters);
  console.log(`Row add result: ${JSON.stringify(fetchResult, null, 2)}`);
  const fetchResultJson = await fetchResult.json();
  console.log(`Row add result JSON: ${JSON.stringify(fetchResultJson, null, 2)}`);
}
