import { Client, GatewayIntentBits, AttachmentBuilder } from "discord.js";
import fetch from "node-fetch";
import "dotenv/config";

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once("ready", () => {
  console.log(`Bot online als ${client.user.tag}`);
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "create") {
    const prompt = interaction.options.getString("prompt");

    await interaction.reply({
      content: "🎨 Generiere dein Bild...",
      ephemeral: true
    });

    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            width: 1024,
            height: 1024,
            num_inference_steps: 30
          }
        })
      }
    );

    const buffer = Buffer.from(await response.arrayBuffer());
    const file = new AttachmentBuilder(buffer, { name: "result.png" });

    await interaction.editReply({
      content: `Fertig! Prompt: **${prompt}**`,
      files: [file]
    });
  }
});

client.login(process.env.DISCORD_TOKEN);
