import { useState, useEffect } from "react";

// ─── CONSTANTS ──────────────────────────────────────────────────────────────
const S = { LANG: 0, AUTH: 1, HOME: 2, SVC: 3, TASK: 4, RECEIPT: 5, ADMIN: 6 };

const LANGS = [
  { code: "en", label: "English" }, { code: "hi", label: "हिन्दी" },
  { code: "mr", label: "मराठी" },  { code: "ta", label: "தமிழ்" },
  { code: "te", label: "తెలుగు" },  { code: "bn", label: "বাংলা" },
];

const T = {
  en: {
    welcome:"Welcome to SUVIDHA", tagline:"Smart Urban Virtual Interactive Digital Helpdesk Assistant",
    selectLang:"Select Your Language", proceed:"Continue", authTitle:"Citizen Authentication",
    authSub:"Secure OTP-based login", mobileLabel:"Mobile Number", sendOtp:"Send OTP",
    verifyLogin:"Verify & Login", demoMode:"Skip → Demo Mode",
    greeting_am:"Good Morning", greeting_pm:"Good Afternoon", greeting_eve:"Good Evening",
    selectService:"Select a Civic Service", back:"← Back", logout:"Logout", admin:"Admin Panel",
    payBill:"Pay Bill", newConn:"New Connection", complaint:"Lodge Complaint",
    meterRead:"Submit Meter Reading", checkStatus:"Check Status", bookCylinder:"Book Cylinder",
    propertyTax:"Property Tax", birthCert:"Birth Certificate", deathCert:"Death Certificate",
    tradeLicense:"Trade License", sewerReq:"Sewage Request", tankerReq:"Water Tanker",
    reportOutage:"Report Outage", wasteComp:"Waste Complaint",
    submit:"Submit Request", proceedPay:"Proceed to Payment",
    paySuccess:"Payment Successful!", reqSubmitted:"Request Submitted!",
    printReceipt:"🖨 Print Receipt", backHome:"🏠 Home",
  },
  hi: {
    welcome:"सुविधा में स्वागत है", tagline:"स्मार्ट शहरी वर्चुअल इंटरेक्टिव हेल्पडेस्क सहायक",
    selectLang:"अपनी भाषा चुनें", proceed:"जारी रखें", authTitle:"नागरिक प्रमाणीकरण",
    authSub:"OTP-आधारित सुरक्षित लॉगिन", mobileLabel:"मोबाइल नंबर", sendOtp:"OTP भेजें",
    verifyLogin:"सत्यापित करें", demoMode:"डेमो मोड में जारी रखें",
    greeting_am:"सुप्रभात", greeting_pm:"नमस्ते", greeting_eve:"शुभ संध्या",
    selectService:"एक सेवा चुनें", back:"← वापस", logout:"लॉगआउट", admin:"व्यवस्थापक",
    payBill:"बिल भुगतान", newConn:"नया कनेक्शन", complaint:"शिकायत दर्ज करें",
    meterRead:"मीटर रीडिंग", checkStatus:"स्थिति जांचें", bookCylinder:"सिलिंडर बुक",
    propertyTax:"संपत्ति कर", birthCert:"जन्म प्रमाणपत्र", deathCert:"मृत्यु प्रमाणपत्र",
    tradeLicense:"व्यापार लाइसेंस", sewerReq:"सीवर अनुरोध", tankerReq:"टैंकर अनुरोध",
    reportOutage:"बिजली कटौती", wasteComp:"कचरा शिकायत",
    submit:"अनुरोध सबमिट करें", proceedPay:"भुगतान करें",
    paySuccess:"भुगतान सफल!", reqSubmitted:"अनुरोध सबमिट!", printReceipt:"🖨 रसीद प्रिंट", backHome:"🏠 होम",
  },
};
["mr","ta","te","bn"].forEach(l => { T[l] = { ...T.en }; });
T.mr.welcome = "सुविधामध्ये स्वागत"; T.ta.welcome = "சுவிதாவுக்கு வரவேற்கிறோம்";
T.te.welcome = "సువిధకు స్వాగతం"; T.bn.welcome = "সুবিধায় স্বাগতম";

const SERVICES = [
  {
    id: "electricity", color: "#fbbf24", glow: "rgba(251,191,36,0.2)",
    icon: "⚡", label: { en:"Electricity", hi:"विद्युत", mr:"विद्युत", ta:"மின்சாரம்", te:"విద్యుత్", bn:"বিদ্যুৎ" },
    tasks: [
      { id:"bill_pay",      icon:"💳", key:"payBill" },
      { id:"new_conn",      icon:"🔌", key:"newConn" },
      { id:"complaint",     icon:"📋", key:"complaint" },
      { id:"meter_reading", icon:"📊", key:"meterRead" },
      { id:"status",        icon:"🔍", key:"checkStatus" },
      { id:"outage",        icon:"⚠️", key:"reportOutage" },
    ],
  },
  {
    id: "gas", color: "#fb923c", glow: "rgba(251,146,60,0.2)",
    icon: "🔥", label: { en:"Gas", hi:"गैस", mr:"गॅस", ta:"கேஸ்", te:"గ్యాస్", bn:"গ্যাস" },
    tasks: [
      { id:"cylinder_book", icon:"🫙", key:"bookCylinder" },
      { id:"bill_pay",      icon:"💳", key:"payBill" },
      { id:"new_conn",      icon:"🔧", key:"newConn" },
      { id:"complaint",     icon:"📋", key:"complaint" },
      { id:"status",        icon:"🔍", key:"checkStatus" },
    ],
  },
  {
    id: "water", color: "#38bdf8", glow: "rgba(56,189,248,0.2)",
    icon: "💧", label: { en:"Water & Sanitation", hi:"जल एवं स्वच्छता", mr:"पाणी व स्वच्छता", ta:"நீர் & சுகாதாரம்", te:"నీరు & పారిశుధ్యం", bn:"জল ও পয়ঃনিষ্কাশন" },
    tasks: [
      { id:"bill_pay",  icon:"💳", key:"payBill" },
      { id:"new_conn",  icon:"🔧", key:"newConn" },
      { id:"complaint", icon:"📋", key:"complaint" },
      { id:"sewage",    icon:"🚿", key:"sewerReq" },
      { id:"tanker",    icon:"🚛", key:"tankerReq" },
    ],
  },
  {
    id: "municipal", color: "#4ade80", glow: "rgba(74,222,128,0.2)",
    icon: "🏛️", label: { en:"Municipal Services", hi:"नगरपालिका", mr:"महानगरपालिका", ta:"நகராட்சி", te:"మున్సిపల్", bn:"পৌরসভা" },
    tasks: [
      { id:"property_tax",  icon:"🏠", key:"propertyTax" },
      { id:"birth_cert",    icon:"👶", key:"birthCert" },
      { id:"death_cert",    icon:"📜", key:"deathCert" },
      { id:"trade_license", icon:"🏪", key:"tradeLicense" },
      { id:"complaint",     icon:"📋", key:"complaint" },
      { id:"waste",         icon:"♻️", key:"wasteComp" },
    ],
  },
];

// ─── SHARED HELPERS ───────────────────────────────────────────────────────────
function Field({ label, value, onChange, placeholder, type = "text", opts = [] }) {
  const base = {
    width: "100%", background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10,
    padding: "13px 16px", color: "#f1f5f9", fontSize: 15,
    fontFamily: "'Rajdhani',sans-serif", outline: "none", boxSizing: "border-box",
  };
  return (
    <div>
      <label style={{ color:"#64748b", fontSize:11, letterSpacing:1, display:"block", marginBottom:6 }}>
        {label.toUpperCase()}
      </label>
      {type === "select"
        ? <select value={value} onChange={e => onChange(e.target.value)} style={{ ...base, cursor:"pointer" }}>
            <option value="">— Select —</option>
            {opts.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        : type === "textarea"
        ? <textarea value={value} onChange={e => onChange(e.target.value)}
            placeholder={placeholder} rows={3} style={{ ...base, resize:"vertical" }} />
        : <input type={type} value={value} onChange={e => onChange(e.target.value)}
            placeholder={placeholder} style={base} />
      }
    </div>
  );
}

function GhostBtn({ label, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 10, padding: "10px 20px", color: "#64748b",
      fontSize: 13, fontWeight: 700, fontFamily: "'Rajdhani',sans-serif",
      cursor: "pointer", letterSpacing: 1,
    }}>{label}</button>
  );
}

// ─── TOP BAR ─────────────────────────────────────────────────────────────────
function TopBar({ screen, onLogout }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "10px 28px", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(255,255,255,0.06)", zIndex: 10, flexShrink: 0,
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:14 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 10,
          background: "linear-gradient(135deg,#ff6b00,#f97316)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, fontWeight: 900, color: "#fff",
          fontFamily: "'Rajdhani',sans-serif", boxShadow: "0 0 20px rgba(255,107,0,0.4)",
        }}>S</div>
        <div>
          <div style={{ color:"#fff", fontWeight:800, fontSize:18, fontFamily:"'Rajdhani',sans-serif", letterSpacing:3 }}>SUVIDHA</div>
          <div style={{ color:"#334155", fontSize:10, letterSpacing:1.5 }}>C-DAC  •  Smart City Initiative  •  MeitY</div>
        </div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:20 }}>
        <div style={{ textAlign:"right" }}>
          <div style={{ color:"#e2e8f0", fontSize:20, fontWeight:700, fontFamily:"'Rajdhani',sans-serif", letterSpacing:1 }}>
            {time.toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit", second:"2-digit" })}
          </div>
          <div style={{ color:"#334155", fontSize:11 }}>
            {time.toLocaleDateString("en-IN", { weekday:"short", day:"numeric", month:"short", year:"numeric" })}
          </div>
        </div>
        {screen >= S.HOME && (
          <button onClick={onLogout} style={{
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 8, padding: "8px 16px", color: "#475569", cursor: "pointer",
            fontSize: 12, fontWeight: 600, letterSpacing: 1.5, fontFamily: "'Rajdhani',sans-serif",
          }}>LOGOUT</button>
        )}
      </div>
    </div>
  );
}

// ─── NOTIFICATION TICKER ──────────────────────────────────────────────────────
function Ticker() {
  const msg = "⚡ Power outage: Sector 5 today 2PM–4PM  •  💧 Water disruption: Zone 3, tomorrow 7AM  •  📋 Property tax last date: March 31  •  🔥 Gas price revised ₹903 from April 1  •  🏛️ New service centre opens: April 5";
  return (
    <div style={{
      background: "rgba(255,107,0,0.08)", borderBottom: "1px solid rgba(255,107,0,0.15)",
      padding: "7px 0", overflow: "hidden", flexShrink: 0,
    }}>
      <div style={{
        display: "inline-block", whiteSpace: "nowrap",
        animation: "ticker 35s linear infinite",
        color: "#fb923c", fontSize: 12, letterSpacing: 0.4, paddingLeft: "100%",
      }}>
        {msg}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{msg}
      </div>
    </div>
  );
}

// ─── LANGUAGE SCREEN ─────────────────────────────────────────────────────────
function LangScreen({ selected, onSelect, onContinue }) {
  return (
    <div style={{
      flex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "48px 40px", gap: 44,
    }}>
      <div style={{ textAlign:"center" }}>
        <div style={{
          fontSize: 88, fontWeight: 900, letterSpacing: -3,
          fontFamily: "'Rajdhani',sans-serif", lineHeight: 1,
          background: "linear-gradient(135deg,#ff6b00 20%,#fbbf24 80%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          filter: "drop-shadow(0 0 40px rgba(255,107,0,0.3))",
        }}>SUVIDHA</div>
        <div style={{ color:"#475569", fontSize:13, marginTop:10, letterSpacing:3, textTransform:"uppercase" }}>
          Smart Urban Virtual Interactive Digital Helpdesk Assistant
        </div>
        <div style={{ color:"#1e3a5f", fontSize:12, marginTop:5, letterSpacing:1 }}>
          Powered by C-DAC  •  Ministry of Electronics & IT  •  Government of India
        </div>
      </div>

      <div style={{ textAlign:"center", width:"100%", maxWidth:580 }}>
        <div style={{ color:"#94a3b8", fontSize:16, marginBottom:24, letterSpacing:1 }}>
          अपनी भाषा चुनें  /  Select Your Language
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
          {LANGS.map(l => {
            const sel = selected === l.code;
            return (
              <button key={l.code} onClick={() => onSelect(l.code)} style={{
                background: sel ? "linear-gradient(135deg,rgba(255,107,0,0.25),rgba(251,146,60,0.15))" : "rgba(255,255,255,0.04)",
                border: `2px solid ${sel ? "#ff6b00" : "rgba(255,255,255,0.08)"}`,
                borderRadius: 14, padding: "22px 20px",
                color: sel ? "#fbbf24" : "#94a3b8",
                fontSize: 24, fontWeight: 700,
                fontFamily: "'Noto Sans',sans-serif",
                cursor: "pointer", transition: "all 0.2s",
                transform: sel ? "scale(1.04)" : "scale(1)",
                boxShadow: sel ? "0 0 24px rgba(255,107,0,0.25)" : "none",
              }}>{l.label}</button>
            );
          })}
        </div>
      </div>

      <div style={{ width:"100%", maxWidth:580 }}>
        <button onClick={onContinue} disabled={!selected} style={{
          width: "100%",
          background: selected ? "linear-gradient(135deg,#ff6b00,#f97316)" : "rgba(255,255,255,0.06)",
          border: "none", borderRadius: 12, padding: "18px",
          color: selected ? "#fff" : "#334155",
          fontSize: 17, fontWeight: 800, fontFamily: "'Rajdhani',sans-serif",
          letterSpacing: 2, cursor: selected ? "pointer" : "not-allowed",
          transition: "all 0.2s",
          boxShadow: selected ? "0 8px 28px rgba(255,107,0,0.4)" : "none",
        }}>CONTINUE →</button>
      </div>
    </div>
  );
}

// ─── AUTH SCREEN ─────────────────────────────────────────────────────────────
function AuthScreen({ onLogin, t }) {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState("mobile");

  const handleSend = () => { setLoading(true); setTimeout(() => { setSent(true); setLoading(false); }, 900); };
  const handleVerify = () => {
    setLoading(true);
    setTimeout(() => onLogin({ name:"Rajesh Kumar", mobile, accountNo:"CDAC-2026-8821", city:"Pune" }), 700);
  };

  return (
    <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:40 }}>
      <div style={{
        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 20, padding: "44px 52px", width: "100%", maxWidth: 460,
        backdropFilter: "blur(10px)",
      }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <div style={{ fontSize:48 }}>🪪</div>
          <div style={{ color:"#f1f5f9", fontSize:26, fontWeight:800, fontFamily:"'Rajdhani',sans-serif", marginTop:8 }}>
            {t.authTitle}
          </div>
          <div style={{ color:"#475569", fontSize:13, marginTop:4 }}>{t.authSub}</div>
        </div>

        {/* Method tabs */}
        <div style={{ display:"flex", gap:6, background:"rgba(0,0,0,0.3)", borderRadius:10, padding:4, marginBottom:24 }}>
          {[["mobile","📱 Mobile OTP"],["aadhaar","🪪 Aadhaar"]].map(([id,lbl]) => (
            <div key={id} onClick={() => setMethod(id)} style={{
              flex:1, textAlign:"center", padding:"10px", borderRadius:8, cursor:"pointer",
              background: method===id ? "rgba(255,107,0,0.2)" : "transparent",
              color: method===id ? "#fb923c" : "#475569",
              border: method===id ? "1px solid rgba(255,107,0,0.3)" : "1px solid transparent",
              fontSize:13, fontWeight:600, transition:"all 0.2s",
            }}>{lbl}</div>
          ))}
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          <div>
            <label style={{ color:"#64748b", fontSize:11, letterSpacing:1, display:"block", marginBottom:6 }}>
              {t.mobileLabel.toUpperCase()}
            </label>
            <div style={{ display:"flex", gap:8 }}>
              <div style={{
                background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
                borderRadius:10, padding:"13px 14px", color:"#64748b", fontSize:14, whiteSpace:"nowrap",
              }}>+91</div>
              <input type="tel" maxLength={10} value={mobile}
                onChange={e => setMobile(e.target.value.replace(/\D/g,""))}
                placeholder="9876543210"
                style={{
                  flex:1, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
                  borderRadius:10, padding:"13px 16px", color:"#f1f5f9", fontSize:18,
                  fontFamily:"'Rajdhani',sans-serif", outline:"none", letterSpacing:2,
                }} />
            </div>
          </div>

          {!sent ? (
            <button onClick={handleSend} disabled={mobile.length !== 10 || loading} style={{
              background: mobile.length===10 ? "linear-gradient(135deg,#ff6b00,#f97316)" : "rgba(255,255,255,0.06)",
              border:"none", borderRadius:12, padding:"16px",
              color: mobile.length===10 ? "#fff" : "#334155",
              fontSize:15, fontWeight:800, fontFamily:"'Rajdhani',sans-serif",
              letterSpacing:1.5, cursor: mobile.length===10 ? "pointer" : "not-allowed",
              boxShadow: mobile.length===10 ? "0 6px 24px rgba(255,107,0,0.4)" : "none",
            }}>
              {loading ? "Sending…" : t.sendOtp}
            </button>
          ) : (
            <>
              <div>
                <label style={{ color:"#64748b", fontSize:11, letterSpacing:1, display:"block", marginBottom:6 }}>
                  ENTER OTP
                </label>
                <input type="tel" maxLength={6} value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g,""))}
                  placeholder="● ● ● ● ● ●"
                  style={{
                    width:"100%", background:"rgba(255,255,255,0.06)",
                    border:"1px solid rgba(255,107,0,0.4)", borderRadius:10,
                    padding:"14px", color:"#fbbf24", fontSize:32,
                    fontFamily:"'Rajdhani',sans-serif", outline:"none",
                    letterSpacing:20, textAlign:"center", boxSizing:"border-box",
                  }} />
                <div style={{ color:"#22c55e", fontSize:12, marginTop:6 }}>✓ OTP sent  (Demo: any 6 digits)</div>
              </div>
              <button onClick={handleVerify} disabled={otp.length!==6 || loading} style={{
                background: otp.length===6 ? "linear-gradient(135deg,#22c55e,#16a34a)" : "rgba(255,255,255,0.06)",
                border:"none", borderRadius:12, padding:"16px",
                color: otp.length===6 ? "#fff" : "#334155",
                fontSize:15, fontWeight:800, fontFamily:"'Rajdhani',sans-serif",
                letterSpacing:1.5, cursor: otp.length===6 ? "pointer" : "not-allowed",
              }}>
                {loading ? "Verifying…" : t.verifyLogin}
              </button>
            </>
          )}

          <div style={{ textAlign:"center", marginTop:4 }}>
            <button
              onClick={() => onLogin({ name:"Demo Citizen", mobile:"9999999999", accountNo:"DEMO-0001", city:"Pune" })}
              style={{ background:"none", border:"none", color:"#334155", fontSize:12, cursor:"pointer", textDecoration:"underline" }}
            >{t.demoMode}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── HOME SCREEN ─────────────────────────────────────────────────────────────
function HomeScreen({ user, lang, t, onService, onAdmin }) {
  const h = new Date().getHours();
  const greet = h < 12 ? t.greeting_am : h < 17 ? t.greeting_pm : t.greeting_eve;

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", padding:"28px 36px", gap:24, overflowY:"auto" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div>
          <div style={{ color:"#475569", fontSize:13, letterSpacing:1 }}>{greet}</div>
          <div style={{ color:"#f1f5f9", fontSize:34, fontWeight:900, fontFamily:"'Rajdhani',sans-serif", letterSpacing:1 }}>
            {user?.name}
          </div>
          <div style={{ color:"#334155", fontSize:12, marginTop:2 }}>
            Account: {user?.accountNo}  •  {user?.city}
          </div>
        </div>
        <button onClick={onAdmin} style={{
          background:"rgba(167,139,250,0.08)", border:"1px solid rgba(167,139,250,0.2)",
          borderRadius:10, padding:"11px 22px", color:"#a78bfa", fontSize:13,
          fontWeight:700, cursor:"pointer", letterSpacing:1, fontFamily:"'Rajdhani',sans-serif",
        }}>⚙ {t.admin}</button>
      </div>

      <div style={{ color:"#334155", fontSize:12, letterSpacing:2, textTransform:"uppercase" }}>
        {t.selectService}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:18, flex:1 }}>
        {SERVICES.map(svc => (
          <SvcCard key={svc.id} svc={svc} lang={lang} t={t} onClick={() => onService(svc)} />
        ))}
      </div>
    </div>
  );
}

function SvcCard({ svc, lang, t, onClick }) {
  const [hov, setHov] = useState(false);
  const label = svc.label[lang] || svc.label.en;

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? "linear-gradient(135deg,rgba(0,0,0,0.7),rgba(0,0,0,0.5))" : "rgba(255,255,255,0.025)",
        border: `2px solid ${hov ? svc.color : "rgba(255,255,255,0.07)"}`,
        borderRadius: 18, padding: "28px 30px", cursor: "pointer", textAlign: "left",
        transition: "all 0.25s",
        transform: hov ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hov ? `0 12px 36px ${svc.glow}` : "none",
        display: "flex", flexDirection: "column", gap: 16,
        position: "relative", overflow: "hidden",
      }}
    >
      <div style={{
        position:"absolute", top:-30, right:-30, width:120, height:120, borderRadius:"50%",
        background: svc.glow, filter:"blur(30px)", opacity: hov ? 1 : 0.3, transition:"opacity 0.25s",
      }} />
      <div style={{ fontSize:48 }}>{svc.icon}</div>
      <div>
        <div style={{ color:svc.color, fontSize:24, fontWeight:900, fontFamily:"'Rajdhani',sans-serif", letterSpacing:1 }}>
          {label}
        </div>
        <div style={{ color:"#334155", fontSize:12, marginTop:4 }}>{svc.tasks.length} services available</div>
      </div>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        {svc.tasks.slice(0,3).map(tk => (
          <span key={tk.id} style={{
            background: `${svc.color}15`, border: `1px solid ${svc.color}30`,
            borderRadius:6, padding:"4px 10px", color: svc.color, fontSize:11, fontWeight:600,
          }}>{t[tk.key] || tk.key}</span>
        ))}
      </div>
    </button>
  );
}

// ─── SERVICE DETAIL ───────────────────────────────────────────────────────────
function SvcDetail({ svc, lang, t, onTask, onBack }) {
  const label = svc.label[lang] || svc.label.en;
  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", padding:"28px 36px", gap:24 }}>
      <div style={{ display:"flex", alignItems:"center", gap:16 }}>
        <GhostBtn label={t.back} onClick={onBack} />
        <div style={{ fontSize:36 }}>{svc.icon}</div>
        <div>
          <div style={{ color:svc.color, fontSize:26, fontWeight:900, fontFamily:"'Rajdhani',sans-serif" }}>{label}</div>
          <div style={{ color:"#334155", fontSize:13 }}>Select a service below</div>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, flex:1 }}>
        {svc.tasks.map(tk => (
          <TaskCard key={tk.id} task={tk} svc={svc} t={t} onClick={() => onTask(tk)} />
        ))}
      </div>
    </div>
  );
}

function TaskCard({ task, svc, t, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? `${svc.color}15` : "rgba(255,255,255,0.025)",
        border: `2px solid ${hov ? svc.color : "rgba(255,255,255,0.07)"}`,
        borderRadius: 16, padding: "28px 20px", cursor: "pointer", textAlign: "center",
        transition: "all 0.2s", transform: hov ? "scale(1.04)" : "scale(1)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 14,
        boxShadow: hov ? `0 8px 24px ${svc.glow}` : "none",
      }}
    >
      <div style={{ fontSize:38 }}>{task.icon}</div>
      <div style={{
        color: hov ? svc.color : "#e2e8f0", fontSize:15, fontWeight:800,
        fontFamily:"'Rajdhani',sans-serif", letterSpacing:0.5,
      }}>
        {t[task.key] || task.key}
      </div>
    </button>
  );
}

// ─── TASK FORM ────────────────────────────────────────────────────────────────
function TaskForm({ svc, task, user, t, onSubmit, onBack }) {
  const [f, setF] = useState({});
  const u = (k, v) => setF(p => ({ ...p, [k]:v }));
  const isPay = task.id === "bill_pay" || task.id === "property_tax";
  const isComp = ["complaint","waste","sewage","outage"].includes(task.id);
  const amounts = { electricity:"1,284.50", gas:"438.00", water:"512.00", municipal:"2,800.00" };

  const submit = () => {
    const ref = "REF-" + Math.random().toString(36).slice(2,10).toUpperCase();
    onSubmit({
      service: svc.label.en, task: t[task.key] || task.key, ref,
      amount: isPay ? amounts[svc.id] : null,
      time: new Date().toLocaleString("en-IN"),
    });
  };

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", padding:"28px 36px", gap:22, overflowY:"auto" }}>
      <div style={{ display:"flex", alignItems:"center", gap:16 }}>
        <GhostBtn label={t.back} onClick={onBack} />
        <div style={{ fontSize:32 }}>{task.icon}</div>
        <div>
          <div style={{ color:svc.color, fontSize:22, fontWeight:900, fontFamily:"'Rajdhani',sans-serif" }}>
            {t[task.key] || task.key}
          </div>
          <div style={{ color:"#334155", fontSize:12 }}>{svc.label.en} Department</div>
        </div>
      </div>

      <div style={{
        background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 18, padding: "32px 36px",
        display: "flex", flexDirection: "column", gap: 18, maxWidth: 600,
      }}>
        {/* Account badge */}
        <div style={{
          background: `${svc.color}10`, border: `1px solid ${svc.color}25`,
          borderRadius: 10, padding: "10px 16px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{ color:"#64748b", fontSize:12 }}>Account Holder</span>
          <span style={{ color:"#f1f5f9", fontSize:14, fontWeight:700, fontFamily:"'Rajdhani',sans-serif" }}>
            {user?.name}  •  {user?.accountNo}
          </span>
        </div>

        {/* Bill Payment */}
        {isPay && <>
          <Field label="Consumer Number" value={f.acc || user?.accountNo || ""} onChange={v => u("acc",v)} />
          <div style={{
            background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)",
            borderRadius: 12, padding: "18px 20px",
          }}>
            <div style={{ color:"#64748b", fontSize:12, letterSpacing:1 }}>OUTSTANDING AMOUNT</div>
            <div style={{ color:"#fbbf24", fontSize:42, fontWeight:900, fontFamily:"'Rajdhani',sans-serif", marginTop:4 }}>
              ₹ {amounts[svc.id]}
            </div>
            <div style={{ color:"#334155", fontSize:12, marginTop:4 }}>Due: March 31, 2026</div>
          </div>
          <Field label="Payment Method" type="select" value={f.pay || ""} onChange={v => u("pay",v)}
            opts={["UPI (PhonePe / GPay)","Debit Card","Credit Card","Net Banking","Cash"]} />
        </>}

        {/* Complaint */}
        {isComp && <>
          <Field label="Consumer / Account Number" value={f.acc || ""} onChange={v => u("acc",v)} placeholder="e.g. ELEC-2024-8821" />
          <Field label="Category" type="select" value={f.cat || ""} onChange={v => u("cat",v)}
            opts={["No Supply / Outage","Billing Error","Meter Fault","New Connection Delay","Staff Conduct","Other"]} />
          <Field label="Description" type="textarea" value={f.desc || ""} onChange={v => u("desc",v)}
            placeholder="Please describe your issue in detail…" />
          <Field label="Preferred Callback" type="select" value={f.cb || ""} onChange={v => u("cb",v)}
            opts={["Morning 9AM–12PM","Afternoon 12PM–4PM","Evening 4PM–7PM"]} />
        </>}

        {/* New Connection */}
        {task.id === "new_conn" && <>
          <Field label="Full Name" value={f.name || user?.name || ""} onChange={v => u("name",v)} />
          <Field label="Full Address with PIN" value={f.addr || ""} onChange={v => u("addr",v)} placeholder="House no., Street, Area, City - PIN" />
          <Field label="Connection Type" type="select" value={f.type || ""} onChange={v => u("type",v)}
            opts={["Domestic (Residential)","Commercial","Industrial"]} />
          {svc.id === "electricity" &&
            <Field label="Load Required (kW)" value={f.load || ""} onChange={v => u("load",v)} placeholder="e.g. 2.5" />
          }
        </>}

        {/* Meter Reading */}
        {task.id === "meter_reading" && <>
          <Field label="Meter Number" value={f.mtr || ""} onChange={v => u("mtr",v)} placeholder="MTR-XXXXXXXX" />
          <Field label="Current Reading (kWh)" value={f.rdg || ""} onChange={v => u("rdg",v)} placeholder="e.g. 4521" type="number" />
          <div style={{ color:"#334155", fontSize:13 }}>📷 Meter photo upload available at the kiosk scanner</div>
        </>}

        {/* Gas Cylinder */}
        {task.id === "cylinder_book" && <>
          <Field label="LPG Consumer ID" value={f.lpg || ""} onChange={v => u("lpg",v)} placeholder="LPG-XXXXX" />
          <Field label="Distributor Name" value={f.dist || ""} onChange={v => u("dist",v)} />
          <Field label="Delivery Preference" type="select" value={f.del || ""} onChange={v => u("del",v)}
            opts={["Home Delivery","Self Pickup"]} />
        </>}

        {/* Water Tanker */}
        {task.id === "tanker" && <>
          <Field label="Delivery Address" value={f.addr || ""} onChange={v => u("addr",v)} placeholder="Full address" />
          <Field label="Quantity" type="select" value={f.qty || ""} onChange={v => u("qty",v)}
            opts={["1,000 Litres","2,000 Litres","5,000 Litres","10,000 Litres"]} />
          <Field label="Preferred Date" type="date" value={f.date || ""} onChange={v => u("date",v)} />
        </>}

        {/* Certificates */}
        {(task.id === "birth_cert" || task.id === "death_cert") && <>
          <Field label="Full Name" value={f.name || ""} onChange={v => u("name",v)} />
          <Field label={task.id==="birth_cert" ? "Date of Birth" : "Date of Death"} type="date" value={f.date || ""} onChange={v => u("date",v)} />
          <Field label="Father's / Guardian's Name" value={f.father || ""} onChange={v => u("father",v)} />
          <Field label="Hospital / Registration Centre" value={f.hosp || ""} onChange={v => u("hosp",v)} />
        </>}

        {/* Trade License */}
        {task.id === "trade_license" && <>
          <Field label="Business Name" value={f.biz || ""} onChange={v => u("biz",v)} />
          <Field label="Business Type" type="select" value={f.type || ""} onChange={v => u("type",v)}
            opts={["Retail Shop","Food & Beverage","Service Provider","Manufacturing","Healthcare","Education","Other"]} />
          <Field label="Premises Address" value={f.addr || ""} onChange={v => u("addr",v)} />
        </>}

        {/* Status Check */}
        {task.id === "status" && <>
          <Field label="Reference / Application Number" value={f.ref || ""} onChange={v => u("ref",v)} placeholder="REF-XXXXXXXX" />
        </>}

        <button onClick={submit} style={{
          width: "100%",
          background: `linear-gradient(135deg,${svc.color},${svc.color}bb)`,
          border: "none", borderRadius: 12, padding: "18px",
          color: "#000", fontSize: 16, fontWeight: 900,
          fontFamily: "'Rajdhani',sans-serif", letterSpacing: 2, cursor: "pointer",
          boxShadow: `0 8px 28px ${svc.glow}`, marginTop: 8,
        }}>
          {isPay ? `💳 ${t.proceedPay}` : `✓ ${t.submit}`}
        </button>
      </div>
    </div>
  );
}

// ─── RECEIPT ─────────────────────────────────────────────────────────────────
function Receipt({ data, t, onHome }) {
  const isPay = !!data.amount;
  return (
    <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:40 }}>
      <div style={{
        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 20, padding: "48px 52px", width: "100%", maxWidth: 500, textAlign: "center",
      }}>
        <div style={{ fontSize:64, marginBottom:12 }}>{isPay ? "✅" : "📬"}</div>
        <div style={{ color:"#22c55e", fontSize:28, fontWeight:900, fontFamily:"'Rajdhani',sans-serif", marginBottom:4 }}>
          {isPay ? t.paySuccess : t.reqSubmitted}
        </div>
        <div style={{ color:"#334155", fontSize:13, marginBottom:32 }}>
          Your request has been processed successfully
        </div>

        <div style={{
          background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.05)",
          borderRadius: 14, padding: "24px", textAlign: "left", marginBottom: 28,
        }}>
          {[
            ["Reference No", data.ref],
            ["Service",      data.service],
            ["Request Type", data.task],
            ...(data.amount ? [["Amount Paid", "₹ " + data.amount]] : []),
            ["Status",    isPay ? "✓ Confirmed" : "⏳ Processing (24–48 hrs)"],
            ["Timestamp", data.time],
          ].map(([k,v]) => (
            <div key={k} style={{
              display:"flex", justifyContent:"space-between",
              padding:"9px 0", borderBottom:"1px solid rgba(255,255,255,0.04)",
            }}>
              <span style={{ color:"#475569", fontSize:13 }}>{k}</span>
              <span style={{
                color: k==="Reference No"?"#fbbf24" : k==="Status"?"#22c55e" : k==="Amount Paid"?"#4ade80" : "#e2e8f0",
                fontSize:13, fontWeight:700, fontFamily:"'Rajdhani',sans-serif",
              }}>{v}</span>
            </div>
          ))}
        </div>

        <div style={{ display:"flex", gap:12 }}>
          <button onClick={onHome} style={{
            flex:1, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.09)",
            borderRadius:12, padding:14, color:"#94a3b8", fontSize:14, fontWeight:700,
            fontFamily:"'Rajdhani',sans-serif", cursor:"pointer",
          }}>{t.backHome}</button>
          <button style={{
            flex:1, background:"linear-gradient(135deg,#22c55e,#16a34a)",
            border:"none", borderRadius:12, padding:14, color:"#fff", fontSize:14,
            fontWeight:700, fontFamily:"'Rajdhani',sans-serif", cursor:"pointer",
          }}>{t.printReceipt}</button>
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────
function Admin({ t, onBack }) {
  const kpis = [
    { label:"Transactions Today", val:"1,847", delta:"+14%",   c:"#38bdf8" },
    { label:"Pending Requests",   val:"63",    delta:"-11%",   c:"#f87171" },
    { label:"Revenue Collected",  val:"₹3.2L", delta:"+22%",   c:"#4ade80" },
    { label:"Kiosk Uptime",       val:"99.7%", delta:"Healthy", c:"#fbbf24" },
  ];
  const dist = [
    { n:"Electricity", v:612, color:"#fbbf24" },
    { n:"Gas",         v:441, color:"#fb923c" },
    { n:"Water",       v:398, color:"#38bdf8" },
    { n:"Municipal",   v:396, color:"#4ade80" },
  ];
  const total = dist.reduce((a,d) => a + d.v, 0);
  const logs = [
    { ref:"REF-A4X92", svc:"Electricity", task:"Bill Payment",   user:"Priya S.",  t:"2 min ago",  ok:true  },
    { ref:"REF-B7K41", svc:"Water",       task:"New Connection", user:"Amit K.",   t:"5 min ago",  ok:false },
    { ref:"REF-C2P18", svc:"Gas",         task:"Cylinder Booking",user:"Sunita R.", t:"9 min ago",  ok:true  },
    { ref:"REF-D9M67", svc:"Municipal",   task:"Property Tax",   user:"Vikram P.", t:"13 min ago", ok:true  },
    { ref:"REF-E4Q33", svc:"Electricity", task:"Complaint",      user:"Ananya B.", t:"17 min ago", ok:false },
    { ref:"REF-F1R55", svc:"Water",       task:"Water Tanker",   user:"Ravi M.",   t:"21 min ago", ok:true  },
  ];

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", padding:"24px 36px", gap:22, overflowY:"auto" }}>
      <div style={{ display:"flex", alignItems:"center", gap:16 }}>
        <GhostBtn label={t.back} onClick={onBack} />
        <div>
          <div style={{ color:"#a78bfa", fontSize:26, fontWeight:900, fontFamily:"'Rajdhani',sans-serif" }}>
            ⚙ Admin Dashboard
          </div>
          <div style={{ color:"#334155", fontSize:12 }}>Kiosk Operations & Analytics — Live</div>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
        {kpis.map(k => (
          <div key={k.label} style={{
            background:"rgba(255,255,255,0.025)", border:`1px solid ${k.c}25`,
            borderRadius:14, padding:"18px 22px",
          }}>
            <div style={{ color:"#334155", fontSize:11, letterSpacing:0.5, marginBottom:8 }}>{k.label}</div>
            <div style={{ color:k.c, fontSize:30, fontWeight:900, fontFamily:"'Rajdhani',sans-serif" }}>{k.val}</div>
            <div style={{
              color: k.delta.includes("+")?"#22c55e" : k.delta.includes("-")?"#f87171" : "#475569",
              fontSize:11, marginTop:4,
            }}>{k.delta} vs yesterday</div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1.4fr", gap:18 }}>
        {/* Usage chart */}
        <div style={{
          background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.06)",
          borderRadius:14, padding:"22px 24px",
        }}>
          <div style={{ color:"#e2e8f0", fontSize:16, fontWeight:800, fontFamily:"'Rajdhani',sans-serif", marginBottom:20 }}>
            Service Usage Today
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {dist.map(d => (
              <div key={d.n}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                  <span style={{ color:d.color, fontSize:13, fontWeight:700 }}>{d.n}</span>
                  <span style={{ color:"#475569", fontSize:12 }}>{d.v} ({Math.round(d.v/total*100)}%)</span>
                </div>
                <div style={{ background:"rgba(255,255,255,0.06)", borderRadius:4, height:8, overflow:"hidden" }}>
                  <div style={{
                    background: `linear-gradient(90deg,${d.color}cc,${d.color})`,
                    height:8, borderRadius:4, width:`${Math.round(d.v/total*100)}%`,
                  }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{
            marginTop:18, paddingTop:14, borderTop:"1px solid rgba(255,255,255,0.06)",
            display:"flex", justifyContent:"space-between",
          }}>
            <span style={{ color:"#334155", fontSize:12 }}>Total Today</span>
            <span style={{ color:"#f1f5f9", fontSize:16, fontWeight:900, fontFamily:"'Rajdhani',sans-serif" }}>
              {total.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Activity feed */}
        <div style={{
          background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.06)",
          borderRadius:14, padding:"22px 24px",
        }}>
          <div style={{ color:"#e2e8f0", fontSize:16, fontWeight:800, fontFamily:"'Rajdhani',sans-serif", marginBottom:16 }}>
            Live Activity Feed
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {logs.map(l => (
              <div key={l.ref} style={{
                display:"flex", alignItems:"center", justifyContent:"space-between",
                padding:"10px 14px", background:"rgba(255,255,255,0.02)", borderRadius:10,
                borderLeft: `3px solid ${l.ok ? "#22c55e" : "#fbbf24"}`,
              }}>
                <div>
                  <div style={{ color:"#e2e8f0", fontSize:13, fontWeight:700 }}>{l.user} — {l.task}</div>
                  <div style={{ color:"#334155", fontSize:11, marginTop:2 }}>{l.ref}  •  {l.svc}  •  {l.t}</div>
                </div>
                <div style={{
                  background: l.ok ? "rgba(34,197,94,0.12)" : "rgba(251,191,36,0.12)",
                  color: l.ok ? "#22c55e" : "#fbbf24",
                  borderRadius:6, padding:"4px 10px", fontSize:11, fontWeight:700,
                  whiteSpace:"nowrap", fontFamily:"'Rajdhani',sans-serif",
                }}>{l.ok ? "✓ Done" : "⏳ Pending"}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen,  setScreen]  = useState(S.LANG);
  const [lang,    setLang]    = useState(null);
  const [user,    setUser]    = useState(null);
  const [svc,     setSvc]     = useState(null);
  const [task,    setTask]    = useState(null);
  const [receipt, setReceipt] = useState(null);

  const t = T[lang] || T.en;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Noto+Sans:wght@400;600;700&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        @keyframes ticker  { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes glow    { 0%,100%{opacity:1} 50%{opacity:0.4} }
        input,select,textarea { color-scheme:dark; }
        ::-webkit-scrollbar { width:3px; }
        ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.08); border-radius:2px; }
      `}</style>

      <div style={{
        height: "100vh", display: "flex", flexDirection: "column",
        background: "#070d1a", fontFamily: "'Noto Sans',sans-serif",
        overflow: "hidden", animation: "fadeUp 0.3s ease", position: "relative",
      }}>
        {/* Ambient background */}
        <div style={{
          position:"absolute", inset:0, pointerEvents:"none", zIndex:0,
          background: "radial-gradient(ellipse at 15% 50%,rgba(59,130,246,0.07) 0%,transparent 55%), radial-gradient(ellipse at 85% 20%,rgba(255,107,0,0.06) 0%,transparent 50%)",
        }} />

        <div style={{ position:"relative", zIndex:1, display:"flex", flexDirection:"column", height:"100%" }}>
          <TopBar screen={screen} onLogout={() => { setUser(null); setLang(null); setScreen(S.LANG); }} />

          {screen >= S.HOME && screen !== S.ADMIN && <Ticker />}

          <div style={{ flex:1, display:"flex", flexDirection:"column", overflowY:"auto" }}>
            {screen === S.LANG    && <LangScreen selected={lang} onSelect={setLang} onContinue={() => setScreen(S.AUTH)} />}
            {screen === S.AUTH    && <AuthScreen onLogin={u => { setUser(u); setScreen(S.HOME); }} t={t} />}
            {screen === S.HOME    && <HomeScreen user={user} lang={lang} t={t}
                                       onService={s => { setSvc(s); setScreen(S.SVC); }}
                                       onAdmin={() => setScreen(S.ADMIN)} />}
            {screen === S.SVC && svc  && <SvcDetail svc={svc} lang={lang} t={t}
                                           onTask={tk => { setTask(tk); setScreen(S.TASK); }}
                                           onBack={() => setScreen(S.HOME)} />}
            {screen === S.TASK && svc && task && <TaskForm svc={svc} task={task} user={user} t={t}
                                                   onSubmit={d => { setReceipt(d); setScreen(S.RECEIPT); }}
                                                   onBack={() => setScreen(S.SVC)} />}
            {screen === S.RECEIPT && receipt && <Receipt data={receipt} t={t}
                                                  onHome={() => { setReceipt(null); setScreen(S.HOME); }} />}
            {screen === S.ADMIN   && <Admin t={t} onBack={() => setScreen(S.HOME)} />}
          </div>

          {/* Footer */}
          <div style={{
            padding: "7px 28px", background: "rgba(0,0,0,0.4)",
            borderTop: "1px solid rgba(255,255,255,0.04)",
            display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0,
          }}>
            <div style={{ color:"#1a2a3a", fontSize:10, letterSpacing:1 }}>
              C-DAC  •  Ministry of Electronics & Information Technology  •  Government of India  •  Smart City 2.0
            </div>
            <div style={{ display:"flex", gap:6, alignItems:"center" }}>
              <div style={{ width:7, height:7, borderRadius:"50%", background:"#22c55e", animation:"glow 2s infinite" }} />
              <div style={{ color:"#1a2a3a", fontSize:10, letterSpacing:1 }}>SYSTEM ONLINE</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
