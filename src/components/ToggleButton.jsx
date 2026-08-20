export default function ToggleButton({ label, options, value, onChange, showAny = true }) {
  return (
    <div style={{ flex: "1 1 140px", minWidth: 120 }}>
      <label style={{
        fontSize: 11, fontWeight: 600, color: "#888",
        textTransform: "uppercase", letterSpacing: 0.8,
        display: "block", marginBottom: 6,
      }}>
        {label}
      </label>
      <div style={{
        display: "flex", borderRadius: 10, overflow: "hidden",
        border: "1.5px solid #f5c6c6",
      }}>
        {showAny && (
          <button onClick={() => onChange("")} style={{
            flex: 1, padding: "8px 0", border: "none",
            fontSize: 12.5, fontWeight: 600, cursor: "pointer",
            background: value === "" ? "#b71c1c" : "#fff",
            color: value === "" ? "#ffffff" : "#888",
            transition: "all 0.15s",
          }}>
            Any
          </button>
        )}
        {options.map(opt => (
          <button key={opt} onClick={() => onChange(opt)} style={{
            flex: 1, padding: "8px 0", border: "none", cursor: "pointer",
            borderLeft: "1px solid #f5c6c6",
            fontSize: 12.5, fontWeight: 600,
            background: value === opt ? "#b71c1c" : "#fff",
            color: value === opt ? "#ffffff" : "#888",
            transition: "all 0.15s",
          }}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
