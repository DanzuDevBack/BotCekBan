import TelegramBot from "node-telegram-bot-api";
import fetch from "node-fetch";

const token = "8173045335:AAHOiz_zb7rl0wHUt6FWuT3gxTbhU4hsM9o"; // <-- Masukkan token dari BotFather
const bot = new TelegramBot(token, { polling: true });

// Fungsi normalisasi nomor
function normalizeNumber(input) {
  let clean = input.replace(/[+\-\s]/g, "");
  let country = clean.substring(0, 2);
  let number = clean.substring(2);
  return { country, number };
}

// Command /cekban
bot.onText(/\/cekban (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const rawNumber = match[1];

  const { country, number } = normalizeNumber(rawNumber);
  const url = `https://api.fg-project.xyz/api/tools/cekwa?country=${country}&number=${number}`;

  try {
    const response = await fetch(url);
    const result = await response.json();

    let replyText = `📊 WhatsApp Ban Check Result\n`;
    replyText += `\n📞 Number: ${result.Number}`;
    replyText += `\n👤 Creator: ${result.creator || "N/A"}`;
    replyText += `\n🚫 Is Banned: ${result.isBanned ? "Yes" : "No"}`;
    replyText += `\n📌 Requires Official WhatsApp: ${result.isNeedOfficialWa ? "Yes" : "No"}`;

    if (result.isBanned && result.data) {
      replyText += `\n\n⚠️ Ban Details:`;
      replyText += `\n• Violation Type: ${result.data.violation_type || "N/A"}`;
      replyText += `\n• In-App Ban Appeal Available: ${result.data.in_app_ban_appeal ? "Yes" : "No"}`;
      replyText += `\n• Appeal Token: ${result.data.appeal_token || "N/A"}`;
    }

    bot.sendMessage(chatId, replyText);
  } catch (err) {
    bot.sendMessage(chatId, "❌ Error fetching ban data:\n" + err.message);
  }
});
