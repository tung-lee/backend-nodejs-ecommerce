import { Client, GatewayIntentBits } from "discord.js";

class LoggerService {
  private client: Client;

  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });
  }
}

const loggerService = new LoggerService();
export default loggerService;
