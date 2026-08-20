export default function InputField({ label, value, onChange, placeholder, type = "text", fullWidth }) {
  return (
    <div style={{ flex: fullWidth ? undefined : "1 1 160px", minWidth: fullWidth ? undefined : 140 }}>
      <label style={{
        fontSize: 11, fontWeight: 600, color: "#888",
        textTransform: "uppercase", letterSpacing: 0.8,
        display: "block", marginBottom: 5,
      }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%", padding: "9px 12px", borderRadius: 10,
          border: "1.5px solid #f5c6c6",
          fontSize: 11, color: "#b71c1c", outline: "none",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}
