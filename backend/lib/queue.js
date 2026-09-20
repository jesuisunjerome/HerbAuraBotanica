import { Agenda } from "agenda";
import "dotenv/config";

// Setup Agenda instance connecting to MongoDB
export const agenda = new Agenda({
  db: { address: process.env.MONGO_URI, collection: "agendaJobs" },
  processEvery: "30 seconds", // How often to check for jobs
  maxConcurrency: 20 // Max concurrent jobs
});

// Event listeners for monitoring
agenda.on('ready', () => {
  console.log("Agenda.js connected to MongoDB and ready.");
});

agenda.on('error', (error) => {
  console.error("Agenda.js connection error:", error.message);
});
