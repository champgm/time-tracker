jest.mock("../src/Google");

import React from "react";
import { fireEvent, render, RenderAPI } from "react-native-testing-library";
import renderer from "react-test-renderer";

import { recipientConfiguration } from "../src/Configuration/Spreadsheet";
import { Emailer } from "../src/Emailer";
import { sendEmail } from "../src/google/Google";

describe("Emailer", () => {
  let emailer: RenderAPI;
  beforeEach(() => {
    (sendEmail as any).mockClear();
    emailer = render(<Emailer />);
  });

  it("renders correctly", () => {
    const tree = renderer.create(<Emailer />);
    const treeJson = tree.toJSON();
    expect(treeJson).toMatchSnapshot();
  });

  it("Should gather and send all fields", () => {
    const testSubject = "Test Subject";
    const testBody = "Test Body";

    const subject = emailer.getByTestId("cd7b46a4-2d81-47bf-abc1-7142aba8a7b0");
    fireEvent.changeText(subject, testSubject);

    const body = emailer.getByTestId("6b50a3ac-a102-4150-823c-e20d44f0c84d");
    fireEvent.changeText(body, testBody);

    const sendButton = emailer.getByTestId("2d8395f6-03a5-4c61-9c3b-595143aec8bf");
    fireEvent.press(sendButton);

    const defaultRecipient = recipientConfiguration.recipients
      .find((recipient) => recipient.name === recipientConfiguration.defaultRecipient);
    expect(sendEmail).toHaveBeenCalledWith(
      recipientConfiguration.sender,
      defaultRecipient.email,
      testSubject,
      testBody,
    );
  });

  it("Should be able to handle chinese text", () => {
    const testSubject = "我是一只猫";
    const testBody = "我有一个弟弟";

    const subject = emailer.getByTestId("cd7b46a4-2d81-47bf-abc1-7142aba8a7b0");
    fireEvent.changeText(subject, testSubject);

    const body = emailer.getByTestId("6b50a3ac-a102-4150-823c-e20d44f0c84d");
    fireEvent.changeText(body, testBody);

    const sendButton = emailer.getByTestId("2d8395f6-03a5-4c61-9c3b-595143aec8bf");
    fireEvent.press(sendButton);

    const defaultRecipient = recipientConfiguration.recipients
      .find((recipient) => recipient.name === recipientConfiguration.defaultRecipient);
    expect(sendEmail).toHaveBeenCalledWith(
      recipientConfiguration.sender,
      defaultRecipient.email,
      testSubject,
      testBody,
    );
  });

});
