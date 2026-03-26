import { useState } from "react"

export default function SPISimulator() {
  const [text, setText] = useState("Hi")
  const [frames, setFrames] = useState([])
  const [loading, setLoading] = useState(false)

  const simulate = async () => {
    setLoading(true)
    const res = await fetch("http://127.0.0.1:5000/api/spi/simulate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    })
    const data = await res.json()
    setFrames(data.frames)
    setLoading(false)
  }

  return (
    <div>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <div>
          <label style={{ color: "#888", display: "block", marginBottom: "0.3rem" }}>Mesaj (Master -&gt; Slave)</label>
          <input value={text} onChange={e => setText(e.target.value)} style={{ background: "#1a1a1a", color: "white", border: "1px solid #333", padding: "0.5rem 1rem", borderRadius: "6px", fontSize: "1rem" }} />
        </div>
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <button onClick={simulate} style={{ background: "#ff4444", color: "#fff", border: "none", padding: "0.5rem 2rem", borderRadius: "6px", fontSize: "1rem", cursor: "pointer", fontWeight: "bold" }}>
            {loading ? "Simüle ediliyor..." : "▶ Simüle Et"}
          </button>
        </div>
      </div>
      
      <div style={{ marginBottom: "1rem", color: "#888", fontStyle: "italic" }}>
         💡 SPI (Serial Peripheral Interface) 4 hatlıdır. İletişim CS (Chip Select) 0'a çekilince başlar.
      </div>

      {frames.map((frame, i) => (
        <div key={i} style={{ marginBottom: "1.5rem", background: "#111", padding: "1rem", borderRadius: "8px", borderLeft: `4px solid #ff4444` }}>
          <span style={{ color: "#ff4444", fontSize: "1.2rem", fontWeight: "bold", display: "block", marginBottom: "1rem" }}>'{frame.char}' (SPI Mode 0)</span>
          <div style={{ overflowX: "auto", padding: "1rem", background: "#0a0a0a", borderRadius: "6px", border: "1px solid #222" }}>
            <svg width={frame.cs.length * 50} height="280" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
              {frame.cs.map((_, j) => <line key={`grid-${j}`} x1={j * 50} y1="0" x2={j * 50} y2="250" stroke="#222" strokeWidth="1" strokeDasharray="3 3" />)}
              <text x="5" y="45" fill="#ff4444" fontSize="12" fontWeight="bold">CS</text>
              <path d={frame.cs.reduce((acc, bit, j) => {
                  const x = j * 50; const y = bit === 1 ? 20 : 50;
                  if (j === 0) return `M ${x} ${y} L ${x + 50} ${y}`;
                  return acc + ` L ${x} ${frame.cs[j-1] === 1 ? 20 : 50} L ${x} ${y} L ${x + 50} ${y}`;
                }, "")} fill="none" stroke="#ff4444" strokeWidth="3" />
              <text x="5" y="105" fill="#ffaa00" fontSize="12" fontWeight="bold">SCK</text>
              <path d={frame.sck.reduce((acc, active, j) => {
                  const x = j * 50;
                  if (active === 0) return (j === 0) ? `M ${x} 110 L ${x + 50} 110` : acc + ` L ${x} 110 L ${x + 50} 110`;
                  return acc + ` L ${x} 110 L ${x} 80 L ${x + 25} 80 L ${x + 25} 110 L ${x + 50} 110`;
                }, "")} fill="none" stroke="#ffaa00" strokeWidth="2" />
              <text x="5" y="165" fill="#00ff88" fontSize="12" fontWeight="bold">MOSI</text>
              <path d={frame.mosi.reduce((acc, bit, j) => {
                  const x = j * 50; const y = bit === 1 ? 140 : 170;
                  if (j === 0) return `M ${x} ${y} L ${x + 50} ${y}`;
                  return acc + ` L ${x} ${frame.mosi[j-1] === 1 ? 140 : 170} L ${x} ${y} L ${x + 50} ${y}`;
                }, "")} fill="none" stroke="#00ff88" strokeWidth="3" />
              {frame.mosi.map((bit, j) => frame.sck[j] === 1 && <text key={`mosi-bit-${j}`} x={j * 50 + 25} y={155} fill="#00ff88" fontSize="14" fontWeight="bold" textAnchor="middle">{bit}</text>)}
              <text x="5" y="225" fill="#00ccff" fontSize="12" fontWeight="bold">MISO</text>
              <path d={frame.miso.reduce((acc, bit, j) => {
                  const x = j * 50; const y = bit === 1 ? 200 : 230;
                  if (j === 0) return `M ${x} ${y} L ${x + 50} ${y}`;
                  return acc + ` L ${x} ${frame.miso[j-1] === 1 ? 200 : 230} L ${x} ${y} L ${x + 50} ${y}`;
                }, "")} fill="none" stroke="#00ccff" strokeWidth="2" strokeDasharray="5 5" />
              {frame.miso.map((bit, j) => frame.sck[j] === 1 && <text key={`miso-bit-${j}`} x={j * 50 + 25} y={215} fill="#00ccff" fontSize="12" textAnchor="middle">{bit}</text>)}
              {frame.labels.map((label, j) => <text key={`label-${j}`} x={j * 50 + 25} y="270" fill="#888" fontSize="11" textAnchor="middle">{label}</text>)}
            </svg>
          </div>
        </div>
      ))}
    </div>
  )
}