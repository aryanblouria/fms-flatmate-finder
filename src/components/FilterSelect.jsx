export default function FilterSelect({ label, value, onChange, options, placeholder, fullWidth }) {
  return (
    <div style={{ flex: fullWidth ? undefined : "1 1 160px", minWidth: fullWidth ? undefined : 140 }}>
      <label style={{
        fontSize: 11, fontWeight: 600, color: "#888",
        textTransform: "uppercase", letterSpacing: 0.8,
        display: "block", marginBottom: 5,
      }}>
        {label}
      </label>
      <select value={value} onChange={e => onChange(e.target.value)} style={{
        width: "100%", padding: "9px 12px", borderRadius: 10,
        border: "1.5px solid #f5c6c6",
        fontSize: 13.5, color: "#b71c1c",
        background: "#fff", outline: "none",
        transition: "border-color 0.2s",
      }}
        onFocus={e => e.target.style.borderColor = "#b71c1c"}
        onBlur={e => e.target.style.borderColor = "#f5c6c6"}
      >
        <option value="">{placeholder || "Any"}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
