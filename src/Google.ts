
import { Buffer } from "buffer";
import qs from "qs";
import { configuration } from "./Configuration";

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

export async function sendEmail(sender: string, recipient: string, subject: string, body: string) {
  const bearerToken = await getAccessToken();
  const authorizationHeader = `Bearer ${bearerToken}`;
  const parameters: RequestInit = {
    method: "POST",
    headers: {
      "content-type": "message/rfc822",
      authorization: authorizationHeader,
    },
    body: formatEmail(sender, recipient, subject, body),
  };
  console.log(`Sending email with parameters: ${JSON.stringify(parameters, null, 2)}`);
  const fetchResult = await fetch(configuration.googleAuth.gmailEndpoint, parameters);
  console.log(`Send email result: ${JSON.stringify(fetchResult, null, 2)}`);
  const fetchResultJson = await fetchResult.json();
  console.log(`Send email result JSON: ${JSON.stringify(fetchResultJson, null, 2)}`);
}
