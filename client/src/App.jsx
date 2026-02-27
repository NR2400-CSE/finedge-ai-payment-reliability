import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

const socket = io("http://localhost:5000");

export default function App() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/logs")
      .then(res => setLogs(res.data));

    socket.on("update", data => {
      setLogs(data);
    });
  }, []);

  return (
    <div style={{ background: "#0f172a", minHeight: "100vh", padding: "30px", color: "white" }}>
      <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>
        AI Payment Reliability Dashboard
      </h1>

      {logs.map(log => (
        <motion.div
          key={log.id}
          whileHover={{ scale: 1.02 }}
          style={{
            background: "#1e293b",
            padding: "15px",
            borderRadius: "12px",
            marginBottom: "12px",
            display: "flex",
            justifyContent: "space-between"
          }}
        >
          <div>
            <div><strong>{log.atm}</strong></div>
            <div style={{ fontSize: "13px", color: "#94a3b8" }}>{log.issue}</div>
            <div style={{ fontSize: "12px", color: "#64748b" }}>
              Failure Rate: {(log.failures / log.transactions * 100).toFixed(2)}%
            </div>
          </div>

          <div style={{
            padding: "6px 12px",
            borderRadius: "10px",
            background:
              log.risk === "High" ? "#7f1d1d" :
              log.risk === "Medium" ? "#78350f" :
              "#064e3b"
          }}>
            {log.risk}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
