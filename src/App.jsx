import { useState, useEffect, useCallback } from 'react';
import { auth, loginWithGoogle, logout, onAuthChange, fetchProfiles, createProfile, deleteProfile } from './firebase';
import { LOCALITIES, FOOD_PREFS, ROOM_TYPES, GENDERS, EMPTY_FORM } from './constants';
import Badge from './components/Badge';
import ProfileCard from './components/ProfileCard';
import MultiSelectChips from './components/MultiSelectChips';
import ToggleButton from './components/ToggleButton';
import FilterSelect from './components/FilterSelect';
import InputField from './components/InputField';
import fmsLogo from './assets/fms-logo.png';

function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", padding: "12px 24px", borderRadius: 12, background: type === "error" ? "#c62828" : "#2e7d32", color: "#fff", fontSize: 14, fontWeight: 600, boxShadow: "0 4px 20px rgba(0,0,0,0.2)", zIndex: 1000, animation: "slideUp 0.3s ease-out" }}>
      {message}
      <style>{`@keyframes slideUp { from { opacity: 0; transform: translateX(-50%) translateY(20px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }`}</style>
    </div>
  );
}

function LoginScreen({ onLogin, loading }) {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #b71c1c 0%, #c62828 40%, #d32f2f 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ position: "absolute", top: "10%", left: "5%", width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.03)" }} />
      <div style={{ position: "absolute", bottom: "15%", right: "8%", width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
      <div style={{ textAlign: "center", position: "relative", maxWidth: 380, width: "100%" }}>
        <img src={fmsLogo} alt="FMS Delhi" style={{ width: 90, height: 90, objectFit: "contain", borderRadius: 18, background: "rgba(255,255,255,0.95)", padding: 8, marginBottom: 24 }} />
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 900, color: "#fff", letterSpacing: -0.5, margin: 0 }}>FMS Flatmate Finder</h1>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.65)", marginTop: 8, fontWeight: 500, lineHeight: 1.5 }}>Find your perfect flatmate near FMS Delhi</p>
        <button onClick={onLogin} disabled={loading} style={{
          marginTop: 32, padding: "14px 32px", borderRadius: 12, border: "none",
          background: "#fff", color: "#b71c1c", fontSize: 16, fontWeight: 700,
          cursor: loading ? "wait" : "pointer", opacity: loading ? 0.7 : 1,
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)", transition: "transform 0.15s, box-shadow 0.15s",
          display: "inline-flex", alignItems: "center", gap: 10,
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 28px rgba(0,0,0,0.2)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.15)"; }}
        >
          <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
          {loading ? "Signing in..." : "Sign in with Google"}
        </button>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", marginTop: 24 }}>Created by Group 31</p>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [view, setView] = useState("browse");
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [contactProfile, setContactProfile] = useState(null);
  const [toast, setToast] = useState(null);
  const [fLocalities, setFLocalities] = useState([]);
  const [fFood, setFFood] = useState("");
  const [fRoom, setFRoom] = useState([]);
  const [fAlcohol, setFAlcohol] = useState("");
  const [fSmoking, setFSmoking] = useState("");
  const [fGender, setFGender] = useState("");
  const [fBudget, setFBudget] = useState(30000);
  const [showFilters, setShowFilters] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });

  const showToast = (message, type = "success") => setToast({ message, type });
  const updateForm = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  useEffect(() => {
    const unsub = onAuthChange((u) => { setUser(u); setAuthLoading(false); });
    return unsub;
  }, []);

  const handleLogin = async () => {
    setLoginLoading(true);
    try { await loginWithGoogle(); } catch (e) { showToast("Login failed. Try again.", "error"); }
    setLoginLoading(false);
  };

  const handleLogout = async () => {
    try { await logout(); setView("browse"); } catch (e) { showToast("Logout failed.", "error"); }
  };

  const loadProfiles = useCallback(async () => {
    setLoading(true);
    try { setProfiles(await fetchProfiles()); } catch { showToast("Failed to load profiles.", "error"); }
    setLoading(false);
  }, []);

  useEffect(() => { if (user) loadProfiles(); }, [loadProfiles, user]);

  const filtered = profiles.filter(p => {
    const pLocs = p.localities || [];
    const pRooms = p.roomTypes || (p.roomType ? [p.roomType] : []);
    if (fLocalities.length > 0 && !fLocalities.some(fl => pLocs.includes(fl))) return false;
    if (fRoom.length > 0 && !fRoom.some(fr => pRooms.includes(fr))) return false;
    if (fFood && p.food !== fFood) return false;
    if (fAlcohol && p.alcohol !== fAlcohol) return false;
    if (fSmoking && p.smoking !== fSmoking) return false;
    if (fGender && p.gender !== fGender) return false;
    if (fBudget < 30000 && p.budget && Number(p.budget) > fBudget) return false;
    return true;
  });

  const handlePost = async () => {
    const { name, phone, gender, age, ugDegree, localities, roomTypes, food, alcohol, smoking } = form;
    if (!name || !phone || !gender || !age || !ugDegree || localities.length === 0 || roomTypes.length === 0 || !food || !alcohol || !smoking) { showToast("Please fill all required fields!", "error"); return; }
    if (!/^\d{10}$/.test(phone.replace(/\s/g, ""))) { showToast("Please enter a valid 10-digit phone number.", "error"); return; }
    const ageNum = Number(age);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 45) { showToast("Please enter a valid age (18–45).", "error"); return; }
    setPosting(true);
    try {
      await createProfile({ ...form, age: ageNum, budget: Number(form.budget) });
      showToast("Your ad is now live! 🎉");
      setForm({ ...EMPTY_FORM });
      await loadProfiles();
      setTimeout(() => setView("browse"), 1500);
    } catch { showToast("Failed to post. Please try again.", "error"); }
    setPosting(false);
  };

  const handleDelete = async (profileId) => {
    if (!window.confirm("Are you sure you want to delete your ad?")) return;
    try {
      await deleteProfile(profileId);
      showToast("Ad deleted.");
      await loadProfiles();
      if (view === "contact") { setView("browse"); setContactProfile(null); }
    } catch { showToast("Failed to delete. Try again.", "error"); }
  };

  const clearFilters = () => { setFLocalities([]); setFFood(""); setFRoom([]); setFAlcohol(""); setFSmoking(""); setFGender(""); setFBudget(30000); };
  const activeFilterCount = [fFood, fAlcohol, fSmoking, fGender].filter(Boolean).length + (fLocalities.length > 0 ? 1 : 0) + (fRoom.length > 0 ? 1 : 0) + (fBudget < 30000 ? 1 : 0);

  // Auth loading spinner
  if (authLoading) return (
    <div style={{ minHeight: "100vh", background: "#fff5f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 36, height: 36, border: "3px solid #fde0e0", borderTopColor: "#b71c1c", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  // Login screen
  if (!user) return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <LoginScreen onLogin={handleLogin} loading={loginLoading} />
    </>
  );

  // Main app
  return (
    <div style={{ minHeight: "100vh", background: "#fff5f5", display: "flex", flexDirection: "column" }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <header style={{ background: "linear-gradient(135deg, #b71c1c 0%, #c62828 60%, #d32f2f 100%)", padding: "28px 20px 22px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
        <div style={{ position: "absolute", bottom: -60, left: -30, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
        <div style={{ maxWidth: 600, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <img src={fmsLogo} alt="FMS Delhi" style={{ width: 56, height: 56, objectFit: "contain", borderRadius: 10, background: "rgba(255,255,255,0.95)", padding: 4 }} />
              <div>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 900, color: "#ffffff", letterSpacing: -0.5, margin: 0 }}>FMS Flatmate Finder</h1>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 2, fontWeight: 500 }}>Find your perfect flatmate near FMS Delhi</p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {user.photoURL && <img src={user.photoURL} alt="" style={{ width: 32, height: 32, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.5)" }} />}
              <button onClick={handleLogout} style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.3)", background: "transparent", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Logout</button>
            </div>
          </div>
          <nav style={{ display: "flex", gap: 8, marginTop: 16 }}>
            {[{ key: "browse", label: "🔍 Browse" }, { key: "post", label: "✍️ Post Ad" }].map(tab => (
              <button key={tab.key} onClick={() => {
                if (tab.key === "post" && profiles.some(p => p.uid === user?.uid)) { showToast("You already have an active ad. Delete it first to post a new one.", "error"); return; }
                setView(tab.key);
              }} style={{ padding: "8px 20px", borderRadius: 10, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: view === tab.key ? "#ffffff" : "rgba(255,255,255,0.12)", color: view === tab.key ? "#b71c1c" : "rgba(255,255,255,0.7)", transition: "all 0.2s" }}>{tab.label}</button>
            ))}
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: 600, margin: "0 auto", padding: "16px 16px 40px", flex: 1, width: "100%", boxSizing: "border-box" }}>

        {view === "browse" && (<>
          <button onClick={() => setShowFilters(!showFilters)} style={{ width: "100%", padding: "12px", borderRadius: 12, border: "1.5px solid #fde0e0", background: "#fff", fontSize: 14, fontWeight: 600, color: "#b71c1c", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, cursor: "pointer" }}>
            <span>⚙️ Filters {activeFilterCount > 0 ? `(${activeFilterCount} active)` : ""}</span>
            <span style={{ fontSize: 12, color: "#888" }}>{showFilters ? "▲ Hide" : "▼ Show"}</span>
          </button>
          {showFilters && (
            <div style={{ background: "#fff", borderRadius: 14, padding: "18px 16px", border: "1px solid #fde0e0", marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <MultiSelectChips label="Localities" options={LOCALITIES} selected={fLocalities} onChange={setFLocalities} />
                <MultiSelectChips label="Room Type" options={ROOM_TYPES} selected={fRoom} onChange={setFRoom} />
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                  <FilterSelect label="Gender" value={fGender} onChange={setFGender} options={GENDERS} />
                  <FilterSelect label="Food Preference" value={fFood} onChange={setFFood} options={FOOD_PREFS} />
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                  <ToggleButton label="Alcohol" options={["Yes", "No"]} value={fAlcohol} onChange={setFAlcohol} />
                  <ToggleButton label="Smoking" options={["Yes", "No"]} value={fSmoking} onChange={setFSmoking} />
                </div>
                <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 6 }}>Max Budget: {fBudget >= 30000 ? "Any" : `₹${fBudget.toLocaleString('en-IN')}`}</label>
                    <input type="range" min={10000} max={30000} step={1000} value={fBudget} onChange={e => setFBudget(Number(e.target.value))} style={{ width: "100%", accentColor: "#b71c1c" }} />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#aaa", marginTop: 2 }}>
                      <span>₹10k</span>
                      <span>₹30k</span>
                    </div>
                  </div>
              </div>
              {activeFilterCount > 0 && <button onClick={clearFilters} style={{ marginTop: 14, padding: "7px 16px", borderRadius: 8, border: "1px solid #f5c6c6", background: "transparent", fontSize: 12, color: "#888", fontWeight: 600, cursor: "pointer" }}>✕ Clear all filters</button>}
            </div>
          )}
          <div style={{ fontSize: 13, color: "#888", marginBottom: 10, fontWeight: 500 }}>{loading ? "Loading profiles..." : `${filtered.length} flatmate${filtered.length !== 1 ? "s" : ""} found`}</div>
          {loading && (
            <div style={{ textAlign: "center", padding: 40 }}>
              <div style={{ width: 36, height: 36, border: "3px solid #fde0e0", borderTopColor: "#b71c1c", borderRadius: "50%", margin: "0 auto", animation: "spin 0.8s linear infinite" }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {!loading && filtered.length === 0 && <div style={{ textAlign: "center", padding: 40, color: "#aaa", fontSize: 15 }}>No flatmates yet. Be the first to post an ad!</div>}
            {filtered.map(p => (
              <ProfileCard key={p.id} profile={p} isOwner={user && p.uid === user.uid} onContact={prof => { setContactProfile(prof); setView("contact"); }} onDelete={() => handleDelete(p.id)} />
            ))}
          </div>
        </>)}

        {view === "post" && (
          <div style={{ background: "#fff", borderRadius: 16, padding: "24px 20px", border: "1px solid #fde0e0", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: "#b71c1c", marginBottom: 18 }}>Post Your Flatmate Ad</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <InputField label="Your Name *" value={form.name} onChange={v => updateForm("name", v)} placeholder="e.g. Rahul Kumar" />
                <InputField label="Phone / WhatsApp *" value={form.phone} onChange={v => updateForm("phone", v)} placeholder="e.g. 9876543210" type="tel" />
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <FilterSelect label="Gender *" value={form.gender} onChange={v => updateForm("gender", v)} options={GENDERS} placeholder="Select" />
                <InputField label="Age *" value={form.age} onChange={v => updateForm("age", v)} placeholder="e.g. 24" />
                <InputField label="Home State *" value={form.state} onChange={v => updateForm("state", v)} placeholder="e.g. Maharashtra" />
              </div>
              <div><InputField label="UG Degree & College *" value={form.ugDegree} onChange={v => updateForm("ugDegree", v)} placeholder="e.g. B.Tech (IIT Delhi)" fullWidth /></div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                  <span></span>
                  <button onClick={() => updateForm("localities", form.localities.length === LOCALITIES.length ? [] : [...LOCALITIES])} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, color: "#b71c1c", padding: 0 }}>
                    {form.localities.length === LOCALITIES.length ? "Clear all" : "Select all"}
                  </button>
                </div>
                <MultiSelectChips label="Preferred Localities * (tap to select)" options={LOCALITIES} selected={form.localities} onChange={v => updateForm("localities", v)} />
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                  <span></span>
                  <button onClick={() => updateForm("roomTypes", form.roomTypes.length === ROOM_TYPES.length ? [] : [...ROOM_TYPES])} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, color: "#b71c1c", padding: 0 }}>
                    {form.roomTypes.length === ROOM_TYPES.length ? "Clear all" : "Select all"}
                  </button>
                </div>
                <MultiSelectChips label="Room Type * (tap to select)" options={ROOM_TYPES} selected={form.roomTypes} onChange={v => updateForm("roomTypes", v)} />
              </div>
              <FilterSelect label="Food Preference *" value={form.food} onChange={v => updateForm("food", v)} options={FOOD_PREFS} placeholder="Select" fullWidth />
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 6 }}>Max Budget per person (₹/month) *: ₹{(Number(form.budget) || 10000).toLocaleString('en-IN')}</label>
                <input type="range" min={10000} max={30000} step={1000} value={form.budget || 10000} onChange={e => updateForm("budget", e.target.value)} style={{ width: "100%", accentColor: "#b71c1c" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#aaa", marginTop: 2 }}>
                  <span>₹10k</span>
                  <span>₹30k</span>
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                <ToggleButton label="Alcohol *" options={["Yes", "No"]} value={form.alcohol} onChange={v => updateForm("alcohol", v)} showAny={false} />
                <ToggleButton label="Smoking *" options={["Yes", "No"]} value={form.smoking} onChange={v => updateForm("smoking", v)} showAny={false} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: "#888", textTransform: "uppercase", letterSpacing: 0.8, display: "block", marginBottom: 5 }}>About You / Preferences</label>
                <textarea value={form.bio} onChange={e => updateForm("bio", e.target.value)} placeholder="Tell potential flatmates about yourself..." rows={3} maxLength={300} style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid #f5c6c6", fontSize: 13.5, color: "#b71c1c", resize: "vertical", outline: "none", boxSizing: "border-box" }} />
                <div style={{ textAlign: "right", fontSize: 11, color: "#bbb", marginTop: 2 }}>{form.bio.length}/300</div>
              </div>
              <button onClick={handlePost} disabled={posting} style={{ width: "100%", padding: "13px", borderRadius: 12, border: "none", background: posting ? "#e57373" : "linear-gradient(135deg, #b71c1c, #c62828)", color: "#ffffff", fontSize: 15, fontWeight: 700, cursor: "pointer", marginTop: 6, opacity: posting ? 0.7 : 1 }}>{posting ? "Posting..." : "🚀 Post Your Ad"}</button>
            </div>
          </div>
        )}

        {view === "contact" && contactProfile && (
          <div style={{ background: "#fff", borderRadius: 16, padding: "28px 22px", border: "1px solid #fde0e0", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", textAlign: "center" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", margin: "0 auto", background: "linear-gradient(135deg, #b71c1c 0%, #c62828 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff", fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700 }}>{contactProfile.name?.charAt(0) || "?"}</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#b71c1c", marginTop: 14 }}>{contactProfile.name}</h2>
            <p style={{ color: "#888", fontSize: 13, marginTop: 4 }}>{contactProfile.courseYear} · {(contactProfile.localities || []).join(", ")}</p>
            <div style={{ marginTop: 20, padding: "16px", background: "#fff5f5", borderRadius: 12, fontSize: 18, fontWeight: 700, color: "#b71c1c", letterSpacing: 1 }}>📞 {contactProfile.phone}</div>
            <a href={`https://wa.me/91${contactProfile.phone?.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", marginTop: 12, padding: "10px 24px", borderRadius: 10, background: "#25d366", color: "#fff", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>💬 WhatsApp</a>
            <p style={{ color: "#aaa", fontSize: 12, marginTop: 12 }}>Please mention "FMS Flatmate Finder" when you reach out</p>
            {user && contactProfile.uid === user.uid && (
              <button onClick={() => handleDelete(contactProfile.id)} style={{ marginTop: 12, padding: "10px 24px", borderRadius: 10, border: "1.5px solid #c62828", background: "transparent", color: "#c62828", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>🗑 Delete My Ad</button>
            )}
            <br />
            <button onClick={() => { setView("browse"); setContactProfile(null); }} style={{ marginTop: 12, padding: "10px 28px", borderRadius: 10, border: "1.5px solid #f5c6c6", background: "transparent", fontSize: 13, fontWeight: 600, color: "#b71c1c", cursor: "pointer" }}>← Back to Browse</button>
          </div>
        )}
      </main>

      <footer style={{ textAlign: "center", padding: "20px 16px", fontSize: 12, color: "#999", background: "#f5e8e8", borderTop: "1px solid #e8cece" }}>
        Made with ❤️ for FMS Delhi
        <br />
        Created by Group 31
      </footer>
    </div>
  );
}
