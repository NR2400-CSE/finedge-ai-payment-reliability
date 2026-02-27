const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

let atmLogs = [
  { id: 1, atm: "ATM-CHN-102", issue: "Network Timeout", location: "Chennai", transactions: 1200, failures: 45 },
  { id: 2, atm: "ATM-CHN-221", issue: "Cash Dispenser Jam", location: "Velachery", transactions: 800, failures: 12 },
  { id: 3, atm: "ATM-CHN-087", issue: "Switch Decline Spike", location: "Tambaram", transactions: 1500, failures: 78 }
];

function calculateRisk(log) {
  const failureRate = log.failures / log.transactions;
  if (failureRate > 0.05) return "High";
  if (failureRate > 0.02) return "Medium";
  return "Low";
}

app.get("/api/logs", (req, res) => {
  const enriched = atmLogs.map(log => ({
    ...log,
    risk: calculateRisk(log)
  }));
  res.json(enriched);
});

setInterval(() => {
  const randomATM = atmLogs[Math.floor(Math.random() * atmLogs.length)];
  randomATM.failures += Math.floor(Math.random() * 5);

  io.emit("update", atmLogs.map(log => ({
    ...log,
    risk: calculateRisk(log)
  })));
}, 5000);

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
