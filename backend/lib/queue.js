import { Agenda } from "agenda";
import { MongoBackend } from "@agendajs/mongo-backend";

export let agenda;

export const initAgenda = (mongoDb) => {
  agenda = new Agenda({
    backend: new MongoBackend({ mongo: mongoDb }),
    processEvery: "30 seconds",
    maxConcurrency: 20
  });

  agenda.on('ready', () => {
    console.log("Agenda.js connected to MongoDB and ready.");
  });

  agenda.on('error', (error) => {
    console.error("Agenda.js connection error:", error.message);
  });

  return agenda;
};
