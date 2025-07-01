const functions = require("firebase-functions");

// Setze den API-Key als Umgebungsvariable für den Server
process.env.HYPIXEL_API_KEY = functions.config().hypixel.key;

// Importiere und starte den SvelteKit Server aus dem Hauptverzeichnis
const server = require("../build/index.js");

// Erstelle die Cloud Function
exports.app = functions.runWith({ memory: "1GB" }).https.onRequest(server.handler);
