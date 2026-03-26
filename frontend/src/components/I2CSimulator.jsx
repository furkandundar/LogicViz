import { useState } from "react"

export default function I2CSimulator() {
  const [text, setText] = useState("Hi")
  const [frames, setFrames] = useState([])
  
  const simulate = async () => {
    const res = await fetch("http://127.0.0.1:5000/api/i2c/simulate", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text })
    })
    const data = await res.json()
    setFrames(data.frames)
  }

  return (
    <div>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <input value={text} onChange={e => setText(e.target.value)} style={{ background: "#1a1a1a", color: "white", border: "1px solid #333", padding: "0.5rem", borderRadius: "6px" }} />
        <button onClick={simulate} style={{ background: "#00ccff", color: "#000", border: "none", padding: "0.5rem 1rem", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>▶ Simüle Et</button>
      </div>
      {frames.map((frame, i) => (
        <div key={i} style={{ marginBottom: "1rem", background: "#111", padding: "1rem", borderRadius: "8px", borderLeft: "4px solid #00ccff" }}>
          <span style={{ color: "#00ccff", fontSize: "1.2rem", fontWeight: "bold", display: "block", marginBottom: "1rem" }}>'{frame.char}'</span>
          <div style={{ overflowX: "auto", background: "#0a0a0a", padding: "1rem", borderRadius: "6px", border: "1px solid #222" }}>
            <svg width={frame.sda.length * 40} height="180" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
              {frame.sda.map((_, j) => <line key={`grid-${j}`} x1={j * 40} y1="0" x2={j * 40} y2="150" stroke="#222" strokeWidth="1" strokeDasharray="2 2" />)}
              <text x="5" y="45" fill="#888" fontSize="12" fontWeight="bold">SCL</text>
              <path d={frame.sda.reduce((acc, _, j) => {
                  const x = j * 40; const y = (j > 0 && j < frame.sda.length - 1 && j % 2 === 0) ? 20 : 60;
                  if (j === 0) return `M ${x} 20 L ${x + 40} 20`;
                  const prevY = (j > 1 && j < frame.sda.length && (j-1) % 2 === 0) ? 20 : 60;
                  return acc + ` L ${x} ${prevY} L ${x} ${y} L ${x + 40} ${y}`;
                }, "")} fill="none" stroke="#ffaa00" strokeWidth="2" />
              <text x="5" y="115" fill="#888" fontSize="12" fontWeight="bold">SDA</text>
              <path d={frame.sda.reduce((acc, bit, j) => {
                  const x = j * 40; const y = bit === 1 ? 90 : 130;
                  if (j === 0) return `M ${x} ${y} L ${x + 40} ${y}`;
                  return acc + ` L ${x} ${frame.sda[j - 1] === 1 ? 90 : 130} L ${x} ${y} L ${x + 40} ${y}`;
                }, "")} fill="none" stroke="#00ccff" strokeWidth="3" />
              {frame.sda.map((bit, j) => <text key={`bit-${j}`} x={j * 40 + 20} y={105} fill="#00ccff" fontSize="12" fontWeight="bold" textAnchor="middle">{bit}</text>)}
              {frame.labels.map((label, j) => <text key={`label-${j}`} x={j * 40 + 20} y="165" fill="#888" fontSize="10" textAnchor="middle">{label}</text>)}
            </svg>
          </div>
        </div>
      ))}
    </div>
  )
}