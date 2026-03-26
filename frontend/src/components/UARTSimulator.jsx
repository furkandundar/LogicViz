import { useState } from "react"

export default function UARTSimulator() {
  const [text, setText] = useState("Hi")
  const [baudRate, setBaudRate] = useState(9600)
  const [parity, setParity] = useState("none")
  const [stopBits, setStopBits] = useState(1)
  const [errorSelect, setErrorSelect] = useState("none") 
  const [frames, setFrames] = useState([])
  const [loading, setLoading] = useState(false)

  const simulate = async () => {
    setLoading(true)
    const res = await fetch("http://127.0.0.1:5000/api/uart/simulate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text, baud_rate: baudRate, parity, stop_bits: stopBits,
        error: errorSelect === "none" ? null : errorSelect
      })
    })
    const data = await res.json()
    const initializedFrames = data.frames.map(f => ({ ...f, userModified: false }))
    setFrames(initializedFrames)
    setLoading(false)
  }

  const checkParityError = (frameArray, labelsArray, currentParitySetting) => {
    if (currentParitySetting === "none") return false;
    let onesCount = 0;
    let parityBitValue = 0;
    labelsArray.forEach((label, idx) => {
      if (label.startsWith("D") && frameArray[idx] === 1) onesCount++;
      if (label === "PAR") parityBitValue = frameArray[idx];
    });
    if (currentParitySetting === "even") return parityBitValue !== (onesCount % 2 === 0 ? 0 : 1);
    else if (currentParitySetting === "odd") return parityBitValue !== (onesCount % 2 === 0 ? 1 : 0);
    return false;
  }

  const handleBitClick = (frameIndex, bitIndex) => {
    const label = frames[frameIndex].labels[bitIndex];
    if (label.startsWith("START") || label.startsWith("STOP")) return;
    const newFrames = [...frames];
    const frame = { ...newFrames[frameIndex] };
    const newFrameBits = [...frame.frame];
    newFrameBits[bitIndex] ^= 1;
    frame.frame = newFrameBits;
    frame.userModified = true;
    const isParityError = checkParityError(newFrameBits, frame.labels, parity);
    
    if (isParityError) frame.error = "KULLANICI MÜDAHALESİ: PARITY HATASI TESPİT EDİLDİ!";
    else frame.error = "Kullanıcı biti değiştirdi (Parity hatası yok).";

    newFrames[frameIndex] = frame;
    setFrames(newFrames);
  }

  return (
    <div>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" }}>
        <div>
          <label style={{ color: "#888", display: "block", marginBottom: "0.3rem" }}>Mesaj</label>
          <input value={text} onChange={e => setText(e.target.value)} style={{ background: "#1a1a1a", color: "white", border: "1px solid #333", padding: "0.5rem 1rem", borderRadius: "6px", fontSize: "1rem", width: "100px" }} />
        </div>
        <div>
          <label style={{ color: "#888", display: "block", marginBottom: "0.3rem" }}>Parity</label>
          <select value={parity} onChange={e => setParity(e.target.value)} style={{ background: "#1a1a1a", color: "white", border: "1px solid #00ff88", padding: "0.5rem 1rem", borderRadius: "6px", fontSize: "1rem" }}>
            <option value="none">Yok</option><option value="even">Çift</option><option value="odd">Tek</option>
          </select>
        </div>
        <div>
          <label style={{ color: "#888", display: "block", marginBottom: "0.3rem" }}>Stop Bits</label>
          <select value={stopBits} onChange={e => setStopBits(Number(e.target.value))} style={{ background: "#1a1a1a", color: "white", border: "1px solid #00ff88", padding: "0.5rem 1rem", borderRadius: "6px", fontSize: "1rem" }}>
            <option value={1}>1</option><option value={2}>2</option>
          </select>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <button onClick={simulate} style={{ background: "#00ff88", color: "#000", border: "none", padding: "0.5rem 2rem", borderRadius: "6px", fontSize: "1rem", cursor: "pointer", fontWeight: "bold" }}>
            {loading ? "Simüle ediliyor..." : "▶ Simüle Et"}
          </button>
        </div>
      </div>
      <div style={{ marginBottom: "1rem", color: "#888", fontStyle: "italic" }}>
         💡 İpucu: Hata simüle etmek için grafikteki bitlerin (0/1) üzerine tıklayın!
      </div>

      {frames.map((frame, i) => (
        <div key={i} style={{ marginBottom: "1.5rem", background: "#111", padding: "1rem", borderRadius: "8px", borderLeft: `4px solid ${frame.error ? "#ff4444" : "#00ff88"}`, transition: "border-color 0.3s" }}>
          <div style={{ marginBottom: "0.5rem" }}>
            <span style={{ color: "#00ff88", fontSize: "1.2rem", fontWeight: "bold" }}>'{frame.char}'</span>
            {frame.error && <span style={{ color: "#ff4444", marginLeft: "1rem", fontWeight: "bold", background: "#330000", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>⚠ {frame.error}</span>}
          </div>
          <div style={{ overflowX: "auto", padding: "1rem 0", background: "#0a0a0a", borderRadius: "6px", border: "1px solid #222" }}>
            <svg width={frame.frame.length * 60} height="90" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
              {frame.frame.map((_, j) => <line key={`grid-${j}`} x1={j * 60} y1="0" x2={j * 60} y2="60" stroke="#222" strokeWidth="1" strokeDasharray="3 3" />)}
              <path d={frame.frame.reduce((acc, bit, j) => {
                  const x = j * 60; const y = bit === 1 ? 15 : 45;
                  if (j === 0) return `M ${x} ${y} L ${x + 60} ${y}`;
                  const prevY = frame.frame[j - 1] === 1 ? 15 : 45;
                  return acc + ` L ${x} ${prevY} L ${x} ${y} L ${x + 60} ${y}`;
                }, "")} fill="none" stroke={frame.error ? "#ff4444" : "#00ff88"} strokeWidth="3" style={{ transition: "stroke 0.3s, d 0.2s" }} />
              {frame.frame.map((bit, j) => {
                const label = frame.labels[j];
                const isClickable = !label.startsWith("START") && !label.startsWith("STOP");
                return (
                  <text key={`bit-${j}`} x={j * 60 + 30} y={32} fill={frame.error ? "#ff4444" : "#00ff88"} fontSize="16" fontWeight="bold" textAnchor="middle" style={{ cursor: isClickable ? "pointer" : "default", userSelect: "none" }} onClick={() => handleBitClick(i, j)}>
                    {bit}
                  </text>
                );
              })}
              {frame.frame.map((bit, j) => (
                <text key={`label-${j}`} x={j * 60 + 30} y="80" fill={frame.labels[j] === "PAR" ? "#ff00ff" : "#666"} fontSize="11" fontWeight={frame.labels[j] === "PAR" ? "bold" : "normal"} textAnchor="middle">{frame.labels[j]}</text>
              ))}
            </svg>
          </div>
        </div>
      ))}
    </div>
  )
}