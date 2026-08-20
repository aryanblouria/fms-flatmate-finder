import { BADGE_COLORS } from '../constants';

export default function Badge({ label, type }) {
  const c = BADGE_COLORS[type] || { bg: "#f5f5f5", text: "#333", border: "#ddd" };
  return (
    <span style={{
      display: "inline-block", padding: "3px 10px", borderRadius: 20,
      fontSize: 12, fontWeight: 500,
      background: c.bg, color: c.text, border: `1px solid ${c.border}`,
      marginRight: 6, marginBottom: 4, whiteSpace: "nowrap",
    }}>
      {label}
    </span>
  );
}
