import {googleToken} from "./GoogleToken";
import {recipientConfiguration} from "./Recipients";

export interface Configuration {
  defaultRecipient: string;
  recipients: Recipient[];
  googleAuth: any;
  sender: string;
}

export interface Recipient {
  email: string;
  name: string;
  selected?: boolean;
}

export const configuration: Configuration = {
  ...recipientConfiguration,
  googleAuth: {
    gmailEndpoint: `https://www.googleapis.com/upload/gmail/v1/users/${recipientConfiguration.sender}/messages/send`,
    tokenEndpoint: "https://www.googleapis.com/oauth2/v4/token",
    tokenRequestBody: googleToken,
  },
};
