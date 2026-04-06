import { useState, useEffect, useRef } from "react";
import { auth, googleProvider } from "./firebase";
import {
  signInWithPopup, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, RecaptchaVerifier,
  signInWithPhoneNumber, signOut
} from "firebase/auth";

const API = "https://tradeconnect-api-production.up.railway.app";

const theme = {
  primary: "#1a56db",
  primaryDark: "#1e429f",
  secondary: "#f3f4f6",
  success: "#057a55",
  danger: "#e02424",
  text: "#111928",
  textLight: "#6b7280",
  border: "#e5e7eb",
  white: "#ffffff",
  navBg: "#1e3a5f",
  cardBg: "#ffffff",
  pageBg: "#f9fafb",
};

// ============ LANDING PAGE ============
function LandingPage({ onGetStarted }) {
  return (
    <div style={{ fontFamily: "Inter, Arial, sans-serif", background: theme.white }}>
      {/* Navbar */}
      <nav style={{ background: theme.navBg, padding: "0 48px", height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 24 }}>📈</span>
          <span style={{ color: "white", fontWeight: 800, fontSize: 20 }}>TradeConnect</span>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <a href="#features" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: 14 }}>Features</a>
          <a href="#how" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: 14 }}>How it works</a>
          <button onClick={onGetStarted}
            style={{ background: theme.primary, color: "white", border: "none",
              padding: "8px 20px", borderRadius: 6, cursor: "pointer", fontWeight: 600, fontSize: 14 }}>
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #1e3a5f 0%, #1a56db 100%)",
        padding: "80px 48px", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <span style={{ background: "rgba(255,255,255,0.15)", color: "white",
            padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 600 }}>
            🚀 Real-time Stock Order Book
          </span>
          <h1 style={{ color: "white", fontSize: 48, fontWeight: 800, margin: "24px 0 16px",
            lineHeight: 1.2 }}>
            Trade Smarter with<br />
            <span style={{ color: "#93c5fd" }}>Instant Order Matching</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 18, marginBottom: 40, lineHeight: 1.6 }}>
            Place BUY and SELL orders. Our DSA-powered matching engine instantly connects buyers with sellers at the best price.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
            <button onClick={onGetStarted}
              style={{ background: "white", color: theme.primary, border: "none",
                padding: "14px 32px", borderRadius: 8, cursor: "pointer",
                fontWeight: 700, fontSize: 16 }}>
              Start Trading →
            </button>
            <button onClick={() => document.getElementById("how").scrollIntoView({ behavior: "smooth" })}
              style={{ background: "transparent", color: "white",
                border: "2px solid rgba(255,255,255,0.4)",
                padding: "14px 32px", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 16 }}>
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div style={{ background: theme.navBg, padding: "20px 48px",
        display: "flex", justifyContent: "center", gap: 64 }}>
        {[
          { label: "Orders Matched", value: "10,000+" },
          { label: "Active Traders", value: "500+" },
          { label: "Uptime", value: "99.9%" },
          { label: "Avg Match Time", value: "<1ms" },
        ].map((s, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{ color: "#93c5fd", fontWeight: 800, fontSize: 24 }}>{s.value}</div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div id="features" style={{ padding: "80px 48px", background: theme.pageBg }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: 32, fontWeight: 800,
            color: theme.text, marginBottom: 8 }}>Why TradeConnect?</h2>
          <p style={{ textAlign: "center", color: theme.textLight, marginBottom: 48, fontSize: 16 }}>
            Built with real DSA algorithms used by stock exchanges worldwide
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {[
              { icon: "⚡", title: "Instant Matching", desc: "Max/Min Heap algorithm matches orders in under 1 millisecond — same tech used by NSE & BSE." },
              { icon: "🔒", title: "Secure Login", desc: "Sign in with Google, Email, or Phone OTP. Your account is protected by Firebase Authentication." },
              { icon: "📊", title: "Live Order Book", desc: "See all pending BUY and SELL orders in real-time. Watch your order get matched instantly." },
              { icon: "💬", title: "Trade Chat", desc: "When your trade matches, chat directly with your trade partner inside the platform." },
              { icon: "📁", title: "Trade History", desc: "Every matched trade is logged with buyer, seller, price, quantity and timestamp." },
              { icon: "🌐", title: "Cloud Powered", desc: "Backend runs on Railway cloud. Available 24/7 from anywhere in the world." },
            ].map((f, i) => (
              <div key={i} style={{ background: "white", borderRadius: 12, padding: 28,
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)", border: `1px solid ${theme.border}` }}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontWeight: 700, fontSize: 18, color: theme.text, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ color: theme.textLight, fontSize: 14, lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div id="how" style={{ padding: "80px 48px", background: "white" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: 32, fontWeight: 800,
            color: theme.text, marginBottom: 8 }}>How It Works</h2>
          <p style={{ textAlign: "center", color: theme.textLight, marginBottom: 48, fontSize: 16 }}>
            Simple 4-step process to execute your first trade
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
            {[
              { step: "01", title: "Sign Up", desc: "Create your account using Google, Email, or Phone number." },
              { step: "02", title: "Place Order", desc: "Enter price and quantity. Choose BUY or SELL." },
              { step: "03", title: "Auto Match", desc: "Our engine matches your order with the best counterpart." },
              { step: "04", title: "Trade Done!", desc: "View your matched trade and chat with your trade partner." },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center", padding: 24 }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%",
                  background: theme.primary, color: "white", fontWeight: 800,
                  fontSize: 18, display: "flex", alignItems: "center",
                  justifyContent: "center", margin: "0 auto 16px" }}>
                  {s.step}
                </div>
                <h3 style={{ fontWeight: 700, fontSize: 16, color: theme.text, marginBottom: 8 }}>{s.title}</h3>
                <p style={{ color: theme.textLight, fontSize: 13, lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: "linear-gradient(135deg, #1e3a5f, #1a56db)",
        padding: "64px 48px", textAlign: "center" }}>
        <h2 style={{ color: "white", fontSize: 32, fontWeight: 800, marginBottom: 16 }}>
          Ready to Start Trading?
        </h2>
        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 16, marginBottom: 32 }}>
          Join hundreds of traders on TradeConnect today
        </p>
        <button onClick={onGetStarted}
          style={{ background: "white", color: theme.primary, border: "none",
            padding: "16px 40px", borderRadius: 8, cursor: "pointer",
            fontWeight: 700, fontSize: 18 }}>
          Get Started Free →
        </button>
      </div>

      {/* Footer */}
      <footer style={{ background: theme.navBg, padding: "32px 48px",
        display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 20 }}>📈</span>
          <span style={{ color: "white", fontWeight: 700 }}>TradeConnect</span>
        </div>
        <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
          © 2026 TradeConnect. Built by Malreddy.
        </span>
        <div style={{ display: "flex", gap: 16 }}>
          <a href="https://github.com/malreddy33/TradeConnect" target="_blank" rel="noreferrer"
            style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, textDecoration: "none" }}>
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}

// ============ LOGIN PAGE ============
function Login({ onLogin, onBack }) {
  const [tab, setTab] = useState("google");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");

  const handleGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      onLogin(result.user.displayName || result.user.email);
    } catch (e) { setError(e.message); }
  };

  const handleEmail = async () => {
    try {
      if (isRegister) {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        onLogin(result.user.email);
      } else {
        const result = await signInWithEmailAndPassword(auth, email, password);
        onLogin(result.user.email);
      }
    } catch (e) { setError(e.message); }
  };

  const sendOTP = async () => {
    try {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", { size: "invisible" });
      const confirmation = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);
      window.confirmationResult = confirmation;
      setOtpSent(true);
    } catch (e) { setError(e.message); }
  };

  const verifyOTP = async () => {
    try {
      const result = await window.confirmationResult.confirm(otp);
      onLogin(result.user.phoneNumber);
    } catch (e) { setError(e.message); }
  };

  const inputStyle = {
    width: "100%", padding: "12px 16px", borderRadius: 8,
    border: `1px solid ${theme.border}`, fontSize: 15,
    marginBottom: 12, boxSizing: "border-box", outline: "none"
  };

  return (
    <div style={{ minHeight: "100vh", background: theme.pageBg, fontFamily: "Inter, Arial, sans-serif",
      display: "flex", flexDirection: "column" }}>
      {/* Navbar */}
      <nav style={{ background: theme.navBg, padding: "0 48px", height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 24 }}>📈</span>
          <span style={{ color: "white", fontWeight: 800, fontSize: 20 }}>TradeConnect</span>
        </div>
        <button onClick={onBack}
          style={{ background: "transparent", color: "rgba(255,255,255,0.8)",
            border: "1px solid rgba(255,255,255,0.3)", padding: "6px 16px",
            borderRadius: 6, cursor: "pointer", fontSize: 14 }}>
          ← Back
        </button>
      </nav>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ background: "white", borderRadius: 16, width: 420,
          boxShadow: "0 4px 24px rgba(0,0,0,0.1)", overflow: "hidden" }}>
          <div style={{ background: `linear-gradient(135deg, ${theme.navBg}, ${theme.primary})`,
            padding: "32px 32px 24px", textAlign: "center" }}>
            <h1 style={{ color: "white", margin: 0, fontSize: 24, fontWeight: 800 }}>Welcome Back</h1>
            <p style={{ color: "rgba(255,255,255,0.7)", margin: "8px 0 0", fontSize: 14 }}>
              Sign in to your TradeConnect account
            </p>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: `1px solid ${theme.border}` }}>
            {[["google", "🔵 Google"], ["email", "✉️ Email"], ["phone", "📱 Phone"]].map(([t, label]) => (
              <button key={t} onClick={() => { setTab(t); setError(""); }}
                style={{ flex: 1, padding: 14, border: "none", cursor: "pointer", fontWeight: 600,
                  borderBottom: tab === t ? `3px solid ${theme.primary}` : "3px solid transparent",
                  background: "none", color: tab === t ? theme.primary : theme.textLight, fontSize: 13 }}>
                {label}
              </button>
            ))}
          </div>

          <div style={{ padding: 32 }}>
            {tab === "google" && (
              <div>
                <p style={{ color: theme.textLight, textAlign: "center", marginBottom: 24, fontSize: 14 }}>
                  Sign in instantly with your Google account
                </p>
                <button onClick={handleGoogle}
                  style={{ width: "100%", padding: 14, background: theme.primary, color: "white",
                    border: "none", borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
                  Continue with Google
                </button>
              </div>
            )}
            {tab === "email" && (
              <div>
                <input placeholder="Email address" value={email}
                  onChange={e => setEmail(e.target.value)} style={inputStyle} />
                <input placeholder="Password" type="password" value={password}
                  onChange={e => setPassword(e.target.value)} style={inputStyle} />
                <button onClick={handleEmail}
                  style={{ width: "100%", padding: 14, background: isRegister ? theme.success : theme.primary,
                    color: "white", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
                  {isRegister ? "Create Account" : "Sign In"}
                </button>
                <p style={{ textAlign: "center", marginTop: 16, color: theme.textLight, fontSize: 13 }}>
                  {isRegister ? "Already have an account? " : "New user? "}
                  <span onClick={() => setIsRegister(!isRegister)}
                    style={{ color: theme.primary, cursor: "pointer", fontWeight: 700 }}>
                    {isRegister ? "Sign In" : "Register"}
                  </span>
                </p>
              </div>
            )}
            {tab === "phone" && (
              <div>
                <div id="recaptcha-container"></div>
                {!otpSent ? (
                  <>
                    <input placeholder="+91 9876543210" value={phone}
                      onChange={e => setPhone(e.target.value)} style={inputStyle} />
                    <button onClick={sendOTP}
                      style={{ width: "100%", padding: 14, background: "#e65100", color: "white",
                        border: "none", borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
                      Send OTP
                    </button>
                  </>
                ) : (
                  <>
                    <p style={{ color: theme.success, fontWeight: 600, fontSize: 14 }}>✅ OTP sent to {phone}</p>
                    <input placeholder="Enter OTP" value={otp}
                      onChange={e => setOtp(e.target.value)} style={inputStyle} />
                    <button onClick={verifyOTP}
                      style={{ width: "100%", padding: 14, background: theme.success, color: "white",
                        border: "none", borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
                      Verify OTP
                    </button>
                  </>
                )}
              </div>
            )}
            {error && (
              <div style={{ marginTop: 16, padding: 12, background: "#fef2f2",
                borderRadius: 8, color: theme.danger, fontSize: 13, border: `1px solid #fecaca` }}>
                ⚠️ {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ NOTIFICATIONS PANEL ============
function NotificationsPanel({ notifications, onClose, onClear }) {
  return (
    <div style={{ position: "fixed", top: 64, right: 16, width: 360, zIndex: 999,
      background: "white", borderRadius: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
      border: `1px solid ${theme.border}`, overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", borderBottom: `1px solid ${theme.border}`,
        display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: theme.text }}>
          🔔 Notifications
        </h3>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onClear}
            style={{ background: "none", border: "none", color: theme.textLight,
              fontSize: 12, cursor: "pointer" }}>Clear all</button>
          <button onClick={onClose}
            style={{ background: "none", border: "none", color: theme.textLight,
              fontSize: 18, cursor: "pointer" }}>×</button>
        </div>
      </div>
      <div style={{ maxHeight: 400, overflowY: "auto" }}>
        {notifications.length === 0 ? (
          <div style={{ padding: 32, textAlign: "center", color: theme.textLight }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🔔</div>
            <p style={{ margin: 0, fontSize: 14 }}>No notifications yet</p>
          </div>
        ) : notifications.map((n, i) => (
          <div key={i} style={{ padding: "14px 20px", borderBottom: `1px solid ${theme.border}`,
            background: n.read ? "white" : "#eff6ff" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span style={{ fontSize: 20 }}>{n.icon}</span>
              <div>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: theme.text }}>{n.title}</p>
                <p style={{ margin: "4px 0 0", fontSize: 13, color: theme.textLight }}>{n.message}</p>
                <p style={{ margin: "4px 0 0", fontSize: 11, color: theme.textLight }}>{n.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ PROFILE PAGE ============
function ProfilePage({ userId, trades, onBack }) {
  const totalTrades = trades.length;
  const buyTrades = trades.filter(t => t.includes("bought")).length;
  const sellTrades = totalTrades - buyTrades;

  return (
    <div style={{ minHeight: "100vh", background: theme.pageBg, fontFamily: "Inter, Arial, sans-serif" }}>
      {/* Header */}
      <div style={{ background: theme.navBg, padding: "32px 48px" }}>
        <button onClick={onBack}
          style={{ background: "transparent", color: "rgba(255,255,255,0.7)",
            border: "none", cursor: "pointer", fontSize: 14, marginBottom: 16 }}>
          ← Back to Dashboard
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%",
            background: theme.primary, display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 32, color: "white", fontWeight: 700 }}>
            {userId.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 style={{ color: "white", margin: 0, fontSize: 24, fontWeight: 800 }}>{userId}</h1>
            <p style={{ color: "rgba(255,255,255,0.6)", margin: "4px 0 0", fontSize: 14 }}>
              TradeConnect Member
            </p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "32px auto", padding: "0 16px" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
          {[
            { label: "Total Trades", value: totalTrades, icon: "📊", color: theme.primary },
            { label: "Buy Orders", value: buyTrades, icon: "📈", color: theme.success },
            { label: "Sell Orders", value: sellTrades, icon: "📉", color: theme.danger },
          ].map((s, i) => (
            <div key={i} style={{ background: "white", borderRadius: 12, padding: 24,
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)", border: `1px solid ${theme.border}`,
              display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 10,
                background: `${s.color}15`, display: "flex",
                alignItems: "center", justifyContent: "center", fontSize: 24 }}>
                {s.icon}
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</p>
                <p style={{ margin: 0, fontSize: 13, color: theme.textLight }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Profile Info */}
        <div style={{ background: "white", borderRadius: 12, padding: 32,
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)", border: `1px solid ${theme.border}`,
          marginBottom: 24 }}>
          <h2 style={{ margin: "0 0 24px", fontSize: 18, fontWeight: 700, color: theme.text }}>
            Account Information
          </h2>
          {[
            { label: "Display Name", value: userId },
            { label: "Account Type", value: "Standard Trader" },
            { label: "Member Since", value: new Date().toLocaleDateString("en-IN") },
            { label: "Status", value: "✅ Active" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between",
              padding: "14px 0", borderBottom: i < 3 ? `1px solid ${theme.border}` : "none" }}>
              <span style={{ color: theme.textLight, fontSize: 14 }}>{item.label}</span>
              <span style={{ color: theme.text, fontSize: 14, fontWeight: 600 }}>{item.value}</span>
            </div>
          ))}
        </div>

        {/* Recent Trades */}
        <div style={{ background: "white", borderRadius: 12, padding: 32,
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)", border: `1px solid ${theme.border}` }}>
          <h2 style={{ margin: "0 0 24px", fontSize: 18, fontWeight: 700, color: theme.text }}>
            Recent Trades
          </h2>
          {trades.length === 0 ? (
            <p style={{ color: theme.textLight, textAlign: "center", padding: 32 }}>No trades yet</p>
          ) : trades.slice(0, 5).map((t, i) => (
            <div key={i} style={{ padding: "12px 0", borderBottom: `1px solid ${theme.border}`,
              display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 20 }}>✅</span>
              <span style={{ fontSize: 14, color: theme.text }}>{t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============ DASHBOARD ============
function Dashboard({ userId, onLogout, onProfile }) {
  const [type, setType] = useState("BUY");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [trades, setTrades] = useState([]);
  const [buyOrders, setBuyOrders] = useState([]);
  const [sellOrders, setSellOrders] = useState([]);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("trade");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { icon: "🎉", title: "Welcome to TradeConnect!", message: "Start trading by placing your first order.", time: "Just now", read: false },
  ]);

  const fetchAll = async () => {
    try {
      const t = await fetch(API + "/api/trades");
      setTrades(await t.json());
      const b = await fetch(API + "/api/orders/buy");
      setBuyOrders(await b.json());
      const s = await fetch(API + "/api/orders/sell");
      setSellOrders(await s.json());
    } catch (e) { console.log("Server error"); }
  };

  useEffect(() => { fetchAll(); }, []);

  const placeOrder = async () => {
    if (!price || !quantity) return;
    try {
      const res = await fetch(API + "/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, type, price: parseFloat(price), quantity: parseInt(quantity) }),
      });
      const msg = await res.text();
      setMessage(msg);
      setNotifications(prev => [{
        icon: type === "BUY" ? "📈" : "📉",
        title: `${type} Order Placed`,
        message: `${quantity} units @ Rs.${price}`,
        time: new Date().toLocaleTimeString(),
        read: false
      }, ...prev]);
      setPrice(""); setQuantity("");
      fetchAll();
    } catch (e) { setMessage("Error connecting to server!"); }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const tabStyle = (t) => ({
    padding: "12px 24px", border: "none", cursor: "pointer", fontWeight: 600,
    borderBottom: activeTab === t ? `3px solid ${theme.primary}` : "3px solid transparent",
    background: "none", color: activeTab === t ? theme.primary : theme.textLight,
    fontSize: 14, transition: "all 0.2s"
  });

  return (
    <div style={{ minHeight: "100vh", background: theme.pageBg, fontFamily: "Inter, Arial, sans-serif" }}>
      {/* Navbar */}
      <nav style={{ background: theme.navBg, padding: "0 32px", height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 22 }}>📈</span>
          <span style={{ color: "white", fontWeight: 800, fontSize: 18 }}>TradeConnect</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* Notification Bell */}
          <button onClick={() => setShowNotifications(!showNotifications)}
            style={{ position: "relative", background: "rgba(255,255,255,0.1)",
              border: "none", borderRadius: 8, width: 40, height: 40,
              cursor: "pointer", fontSize: 18, color: "white" }}>
            🔔
            {unreadCount > 0 && (
              <span style={{ position: "absolute", top: -4, right: -4,
                background: theme.danger, color: "white", borderRadius: "50%",
                width: 18, height: 18, fontSize: 11, fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center" }}>
                {unreadCount}
              </span>
            )}
          </button>

          {/* Profile */}
          <button onClick={onProfile}
            style={{ display: "flex", alignItems: "center", gap: 8,
              background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8,
              padding: "6px 12px", cursor: "pointer", color: "white" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%",
              background: theme.primary, display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 12, fontWeight: 700 }}>
              {userId.charAt(0).toUpperCase()}
            </div>
            <span style={{ fontSize: 13, fontWeight: 600 }}>
              {userId.length > 12 ? userId.substring(0, 12) + "..." : userId}
            </span>
          </button>

          <button onClick={onLogout}
            style={{ background: "rgba(255,255,255,0.1)", color: "white", border: "none",
              padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13 }}>
            Logout
          </button>
        </div>
      </nav>

      {/* Notifications Panel */}
      {showNotifications && (
        <NotificationsPanel
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
          onClear={() => setNotifications([])}
        />
      )}

      {/* Market Bar */}
      <div style={{ background: "white", borderBottom: `1px solid ${theme.border}`,
        padding: "10px 32px", display: "flex", gap: 32, overflowX: "auto" }}>
        {[
          { name: "NIFTY 50", value: "22,475.85", change: "+1.2%" },
          { name: "SENSEX", value: "74,119.39", change: "+0.9%" },
          { name: "BANK NIFTY", value: "48,201.10", change: "-0.3%" },
          { name: "NIFTY IT", value: "32,540.20", change: "+2.1%" },
        ].map((m, i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", whiteSpace: "nowrap" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>{m.name}</span>
            <span style={{ fontSize: 13, color: theme.text }}>{m.value}</span>
            <span style={{ fontSize: 12, fontWeight: 600,
              color: m.change.startsWith("+") ? theme.success : theme.danger }}>
              {m.change}
            </span>
          </div>
        ))}
      </div>

      <div style={{ maxWidth: 1100, margin: "24px auto", padding: "0 16px" }}>
        {/* Welcome Banner */}
        <div style={{ background: `linear-gradient(135deg, ${theme.navBg}, ${theme.primary})`,
          borderRadius: 12, padding: "20px 28px", marginBottom: 24,
          display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ color: "white", margin: 0, fontSize: 20, fontWeight: 700 }}>
              Welcome back, {userId.split(" ")[0]}! 👋
            </h2>
            <p style={{ color: "rgba(255,255,255,0.7)", margin: "4px 0 0", fontSize: 14 }}>
              Ready to trade? Place your orders below.
            </p>
          </div>
          <button onClick={fetchAll}
            style={{ background: "rgba(255,255,255,0.15)", color: "white",
              border: "1px solid rgba(255,255,255,0.3)", padding: "8px 16px",
              borderRadius: 8, cursor: "pointer", fontSize: 13 }}>
            🔄 Refresh
          </button>
        </div>

        {/* Quick Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
          {[
            { label: "Total Trades", value: trades.length, icon: "📊", color: theme.primary },
            { label: "Buy Orders", value: buyOrders.length, icon: "📈", color: theme.success },
            { label: "Sell Orders", value: sellOrders.length, icon: "📉", color: theme.danger },
            { label: "Status", value: "Live", icon: "🟢", color: "#059669" },
          ].map((s, i) => (
            <div key={i} style={{ background: "white", borderRadius: 12, padding: 20,
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: `1px solid ${theme.border}`,
              display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10,
                background: `${s.color}15`, display: "flex",
                alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                {s.icon}
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</p>
                <p style={{ margin: 0, fontSize: 12, color: theme.textLight }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ background: "white", borderRadius: 12, marginBottom: 24,
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: `1px solid ${theme.border}`,
          padding: "0 16px" }}>
          <button style={tabStyle("trade")} onClick={() => setActiveTab("trade")}>📝 Place Order</button>
          <button style={tabStyle("book")} onClick={() => setActiveTab("book")}>📊 Order Book</button>
          <button style={tabStyle("history")} onClick={() => setActiveTab("history")}>📜 Trade History</button>
        </div>

        {/* Place Order */}
        {activeTab === "trade" && (
          <div style={{ background: "white", borderRadius: 12, padding: 32,
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: `1px solid ${theme.border}` }}>
            <h2 style={{ marginTop: 0, fontSize: 20, fontWeight: 700, color: theme.text }}>
              Place New Order
            </h2>
            <div style={{ display: "flex", marginBottom: 24, borderRadius: 8,
              overflow: "hidden", border: `1px solid ${theme.border}`, width: "fit-content" }}>
              <button onClick={() => setType("BUY")}
                style={{ padding: "12px 32px", border: "none", cursor: "pointer",
                  fontWeight: 700, fontSize: 15,
                  background: type === "BUY" ? theme.primary : "white",
                  color: type === "BUY" ? "white" : theme.textLight }}>
                📈 BUY
              </button>
              <button onClick={() => setType("SELL")}
                style={{ padding: "12px 32px", border: "none", cursor: "pointer",
                  fontWeight: 700, fontSize: 15,
                  background: type === "SELL" ? theme.danger : "white",
                  color: type === "SELL" ? "white" : theme.textLight }}>
                📉 SELL
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 500 }}>
              <div>
                <label style={{ display: "block", marginBottom: 6, fontWeight: 600,
                  color: theme.textLight, fontSize: 13 }}>PRICE (Rs.)</label>
                <input placeholder="e.g. 202" value={price} type="number"
                  onChange={e => setPrice(e.target.value)}
                  style={{ width: "100%", padding: 12, borderRadius: 8,
                    border: `1px solid ${theme.border}`, fontSize: 16,
                    boxSizing: "border-box", outline: "none" }} />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: 6, fontWeight: 600,
                  color: theme.textLight, fontSize: 13 }}>QUANTITY</label>
                <input placeholder="e.g. 100" value={quantity} type="number"
                  onChange={e => setQuantity(e.target.value)}
                  style={{ width: "100%", padding: 12, borderRadius: 8,
                    border: `1px solid ${theme.border}`, fontSize: 16,
                    boxSizing: "border-box", outline: "none" }} />
              </div>
            </div>
            <button onClick={placeOrder}
              style={{ marginTop: 24, padding: "14px 40px", border: "none",
                borderRadius: 8, fontSize: 16, fontWeight: 700, cursor: "pointer",
                background: type === "BUY" ? theme.primary : theme.danger, color: "white" }}>
              Place {type} Order →
            </button>
            {message && (
              <div style={{ marginTop: 16, padding: 14, background: "#f0fdf4",
                borderRadius: 8, color: theme.success, fontWeight: 600,
                border: `1px solid #bbf7d0`, fontSize: 14 }}>
                ✅ {message}
              </div>
            )}
          </div>
        )}

        {/* Order Book */}
        {activeTab === "book" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { title: "BUY Orders", color: theme.success, orders: buyOrders, bg: "#f0fdf4" },
              { title: "SELL Orders", color: theme.danger, orders: sellOrders, bg: "#fef2f2" },
            ].map((side, i) => (
              <div key={i} style={{ background: "white", borderRadius: 12, padding: 24,
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: `1px solid ${theme.border}` }}>
                <h3 style={{ color: side.color, marginTop: 0, fontSize: 16, fontWeight: 700 }}>
                  {side.title}
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
                  padding: "8px 0", borderBottom: `1px solid ${theme.border}`,
                  marginBottom: 8 }}>
                  {["Price", "Qty", "User"].map(h => (
                    <span key={h} style={{ fontSize: 12, fontWeight: 700,
                      color: theme.textLight, textTransform: "uppercase" }}>{h}</span>
                  ))}
                </div>
                {side.orders.length === 0 ? (
                  <p style={{ color: theme.textLight, fontSize: 14, textAlign: "center", padding: 16 }}>
                    No orders
                  </p>
                ) : side.orders.map((o, j) => (
                  <div key={j} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
                    padding: "10px 8px", borderRadius: 6, marginBottom: 4,
                    background: side.bg }}>
                    <span style={{ fontWeight: 700, color: side.color }}>Rs.{o.price}</span>
                    <span style={{ color: theme.text }}>{o.quantity}</span>
                    <span style={{ color: theme.textLight, fontSize: 13 }}>@{o.userId}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Trade History */}
        {activeTab === "history" && (
          <div style={{ background: "white", borderRadius: 12, padding: 32,
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: `1px solid ${theme.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: theme.text }}>
                Trade History
              </h2>
              <button onClick={fetchAll}
                style={{ background: theme.pageBg, border: `1px solid ${theme.border}`,
                  padding: "8px 16px", borderRadius: 8, cursor: "pointer",
                  fontSize: 13, color: theme.text }}>
                🔄 Refresh
              </button>
            </div>
            {trades.length === 0 ? (
              <div style={{ textAlign: "center", padding: 48, color: theme.textLight }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
                <p style={{ fontSize: 16, fontWeight: 600 }}>No trades yet</p>
                <p style={{ fontSize: 14 }}>Place your first order to see trades here</p>
              </div>
            ) : trades.map((t, i) => (
              <div key={i} style={{ padding: "16px 20px", marginBottom: 8,
                background: "#f0fdf4", borderRadius: 10,
                border: `1px solid #bbf7d0`,
                display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 20 }}>✅</span>
                <span style={{ fontSize: 14, color: theme.text, fontWeight: 500 }}>{t}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============ MAIN APP ============
function App() {
  const [page, setPage] = useState("landing");
  const [user, setUser] = useState(null);
  const [trades, setTrades] = useState([]);

  const handleLogin = (userId) => {
    setUser(userId);
    setPage("dashboard");
  };

  const handleLogout = () => {
    signOut(auth);
    setUser(null);
    setPage("landing");
  };

  if (page === "landing") return <LandingPage onGetStarted={() => setPage("login")} />;
  if (page === "login") return <Login onLogin={handleLogin} onBack={() => setPage("landing")} />;
  if (page === "profile") return <ProfilePage userId={user} trades={trades} onBack={() => setPage("dashboard")} />;
  return (
    <Dashboard
      userId={user}
      onLogout={handleLogout}
      onProfile={() => setPage("profile")}
    />
  );
}

export default App;