import ky from "ky";
import { decrypt } from "./encryption";


type SendMessageParams = {
    credential: string
    chatId: string | number;
    text: string;
    parseMode?: "Markdown" | "MarkdownV2" | "HTML";
    disablePreview?: boolean;
};

export async function sendTelegramMessage({
    credential,
    chatId,
    text,
    parseMode,
    disablePreview = true,
}: SendMessageParams) {
    try {
        const TELEGRAM_API_BASE = "https://api.telegram.org";

        const BOT_TOKEN = decrypt(credential)
        if (!BOT_TOKEN) {
            throw new Error("TELEGRAM_BOT_TOKEN is not defined");
        }
        
        const res = await ky
            .post(`${TELEGRAM_API_BASE}/bot${BOT_TOKEN}/sendMessage`, {
                json: {
                    chat_id: chatId,
                    text,
                    parse_mode: parseMode,
                    disable_web_page_preview: disablePreview,
                },
                timeout: 10_000,
            })
            .json();

        return res;
    } 
    catch (error) {
        console.error("Telegram sendMessage failed:", error);
        throw error;
    }
}