export default function MultiSelectChips({ label, options, selected, onChange }) {
  const toggle = (opt) => {
    if (selected.includes(opt)) {
      onChange(selected.filter(s => s !== opt));
    } else {
      onChange([...selected, opt]);
    }
  };

  return (
    <div style={{ minWidth: 0 }}>
      <label style={{
        fontSize: 11, fontWeight: 600, color: "#888",
        textTransform: "uppercase", letterSpacing: 0.8,
        display: "block", marginBottom: 6,
      }}>
        {label}
      </label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {options.map(opt => {
          const active = selected.includes(opt);
          return (
            <button key={opt} onClick={() => toggle(opt)} style={{
              padding: "6px 14px", borderRadius: 20,
              fontSize: 12.5, fontWeight: 600,
              border: active ? "1.5px solid #b71c1c" : "1.5px solid #f5c6c6",
              background: active ? "#b71c1c" : "#fff",
              color: active ? "#ffffff" : "#666",
              transition: "all 0.15s",
            }}>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
