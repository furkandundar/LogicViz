import { useState, useEffect } from "react"
import UARTSimulator from "./components/UARTSimulator"
import I2CSimulator from "./components/I2CSimulator"
import SPISimulator from "./components/SPISimulator"

function App() {
  const [protocols, setProtocols] = useState([])
  const [selectedProtocol, setSelectedProtocol] = useState(null)

  useEffect(() => {
    // BURASI GÜNCELLENDİ
    fetch("https://logicviz.onrender.com/api/protocols")
      .then(res => res.json())
      .then(data => {
        setProtocols(data);
        if(data.length > 0) setSelectedProtocol(data[0]); 
      })
  }, [])

  return (
    <div style={{ background: "#0f0f0f", minHeight: "100vh", color: "white", fontFamily: "monospace", padding: "2rem" }}>

      <h1 style={{ color: "#00ff88", borderBottom: "1px solid #333", paddingBottom: "1rem" }}>
        ⚡ LogicViz Analyzer
      </h1>

      <h3 style={{ color: "#888" }}>Protokol Seç:</h3>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        {protocols.map(p => (
          <button
            key={p.id}
            onClick={() => setSelectedProtocol(p)}
            style={{
              background: selectedProtocol?.id === p.id ? "#ffffff" : "#1a1a1a",
              color: selectedProtocol?.id === p.id ? "#000" : "#fff",
              border: "1px solid #555",
              padding: "0.8rem 2rem",
              cursor: "pointer", borderRadius: "6px", fontSize: "1rem", fontWeight: "bold",
              transition: "all 0.2s"
            }}
          >
            {p.name}
          </button>
        ))}
      </div>

      {selectedProtocol?.name === "UART" && <UARTSimulator />}
      {selectedProtocol?.name === "I2C" && <I2CSimulator />}
      {selectedProtocol?.name === "SPI" && <SPISimulator />}

    </div>
  )
}

export default App