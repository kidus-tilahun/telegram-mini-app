export class TelegramAuthError extends Error {
  constructor(message = "Telegram authentication required") {
    super(message);
    this.name = "TelegramAuthError";
  }
}
