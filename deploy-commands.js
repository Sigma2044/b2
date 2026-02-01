import { REST, Routes, SlashCommandBuilder } from "discord.js";
import "dotenv/config";

const commands = [
  new SlashCommandBuilder()
    .setName("create")
    .setDescription("Erstellt ein Bild mit Stable Diffusion XL")
    .addStringOption(option =>
      option.setName("prompt")
        .setDescription("Was soll generiert werden?")
        .setRequired(true)
    )
].map(cmd => cmd.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

try {
  await rest.put(
    Routes.applicationCommands(process.env.CLIENT_ID),
    { body: commands }
  );
  console.log("Slash Commands deployed!");
} catch (err) {
  console.error(err);
}
