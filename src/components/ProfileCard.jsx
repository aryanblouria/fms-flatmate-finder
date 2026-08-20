import Badge from './Badge';

export default function ProfileCard({ profile, isOwner, onContact, onDelete }) {
  const locs = profile.localities || [];
  const rooms = profile.roomTypes || (profile.roomType ? [profile.roomType] : []);

  return (
    <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", border: isOwner ? "1.5px solid #b71c1c" : "1px solid #fde0e0", transition: "box-shadow 0.2s", position: "relative" }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.10)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.06)"}
    >
      {isOwner && <div style={{ position: "absolute", bottom: 0, right: 0, fontSize: 9, fontWeight: 700, color: "#fff", background: "#b71c1c", padding: "4px 12px", borderRadius: "8px 0 0 0", letterSpacing: 0.5 }}>YOUR AD</div>}
      <div style={{ padding: "20px 22px 14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: "linear-gradient(135deg, #b71c1c 0%, #c62828 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff", fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, flexShrink: 0 }}>{profile.name?.charAt(0) || "?"}</div>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: "#b71c1c" }}>{profile.name}</div>
              <div style={{ fontSize: 12, color: "#888", marginTop: 1 }}>{profile.gender}{profile.age ? ` · ${profile.age}y` : ""}{profile.state ? ` · ${profile.state}` : ""}</div>
            </div>
          </div>
          {profile.ugDegree && <Badge label={`🎓 ${profile.ugDegree}`} type="state" />}
        </div>
        <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 2 }}>
          {locs.map(l => <Badge key={l} label={`📍 ${l}`} type="locality" />)}
          <Badge label={`🍽 ${profile.food}`} type="food" />
          <Badge label={`🏠 ${rooms.join(", ")}`} type="room" />
          {profile.budget && <Badge label={`💰 ₹${Number(profile.budget).toLocaleString('en-IN')}/mo`} type="budget" />}
          <Badge label={profile.alcohol === "Yes" ? "🍷 Drinks" : "🚫 No Alcohol"} type={profile.alcohol === "Yes" ? "alcohol_yes" : "alcohol_no"} />
          <Badge label={profile.smoking === "Yes" ? "🚬 Smokes" : "🚭 Non-Smoker"} type={profile.smoking === "Yes" ? "smoking_yes" : "smoking_no"} />
        </div>
        {profile.bio && <div style={{ marginTop: 14, padding: "12px 14px", background: "#fff5f5", borderRadius: 10, fontSize: 13.5, color: "#444", lineHeight: 1.6, borderLeft: "3px solid #b71c1c" }}>"{profile.bio}"</div>}
        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
          <button onClick={() => onContact(profile)} style={{ padding: "8px 18px", borderRadius: 10, border: "none", cursor: "pointer", background: "#b71c1c", color: "#ffffff", fontSize: 13, fontWeight: 600, transition: "opacity 0.2s" }} onMouseEnter={e => e.target.style.opacity = 0.85} onMouseLeave={e => e.target.style.opacity = 1}>📞 View Contact</button>
          {isOwner && <button onClick={onDelete} style={{ padding: "8px 18px", borderRadius: 10, border: "1.5px solid #c62828", background: "transparent", color: "#c62828", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "opacity 0.2s" }} onMouseEnter={e => e.target.style.opacity = 0.7} onMouseLeave={e => e.target.style.opacity = 1}>🗑 Delete</button>}
        </div>
      </div>
    </div>
  );
}
