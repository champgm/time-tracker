import { formatEmail } from "../src/google/Google";

describe("Google", () => {
  describe("formatEmail", () => {
    it("should properly format given inputs", async () => {
      const sender = "sender";
      const recipient = "recipient";
      const subject = "subject";
      const body = "body";
      const formatted = formatEmail(sender, recipient, subject, body);
      expect(formatted).toEqual(`To: ${recipient}\nFrom: ${sender}\nSubject: =?utf-8?B?c3ViamVjdA==?=\n\n${body}\n`);
    });
    it("should handle chinese characters", async () => {
      const sender = "我";
      const recipient = "你";
      const subject = "我们的事";
      const body = "没事";
      const formatted = formatEmail(sender, recipient, subject, body);
      expect(formatted).toEqual(`To: ${recipient}\nFrom: ${sender}\nSubject: =?utf-8?B?5oiR5Lus55qE5LqL?=\n\n${body}\n`);
    });
  });
});
