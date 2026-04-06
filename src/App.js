import { useState, useEffect, useRef } from "react";
import { auth, googleProvider } from "./firebase";
import {
  signInWithPopup, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, RecaptchaVerifier,
  signInWithPhoneNumber, signOut
} from "firebase/auth";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

function Login({ onLogin }) {
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

  const tabBtn = (t, label) => (
    <button onClick={() => { setTab(t); setError(""); }}
      style={{ flex: 1, padding: 12, border: "none", cursor: "pointer", fontWeight: "bold",
        borderBottom: tab === t ? "3px solid #1a73e8" : "3px solid transparent",
        background: "none", color: tab === t ? "#1a73e8" : "#888", fontSize: 14 }}>
      {label}
    </button>
  );

  const inputStyle = {
    width: "100%", padding: "12px 16px", borderRadius: 8, border: "1px solid #ddd",
    fontSize: 15, marginBottom: 12, boxSizing: "border-box"
  };

  const btnStyle = (color) => ({
    width: "100%", padding: 14, background: color, color: "white", border: "none",
    borderRadius: 8, fontSize: 15, fontWeight: "bold", cursor: "pointer", marginTop: 4
  });

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #1a73e8, #0d47a1)",
      display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "white", borderRadius: 16, width: 400,
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)", overflow: "hidden" }}>
        <div style={{ background: "#1a73e8", padding: "32px 32px 24px", textAlign: "center" }}>
          <h1 style={{ color: "white", margin: 0, fontSize: 28 }}>TradeConnect</h1>
          <p style={{ color: "rgba(255,255,255,0.8)", margin: "8px 0 0" }}>Stock Order Book Platform</p>
        </div>
        <div style={{ display: "flex", borderBottom: "1px solid #eee" }}>
          {tabBtn("google", "Google")}
          {tabBtn("email", "Email")}
          {tabBtn("phone", "Phone")}
        </div>
        <div style={{ padding: 32 }}>
          {tab === "google" && (
            <div>
              <p style={{ color: "#555", textAlign: "center", marginBottom: 24 }}>
                Sign in with your Google account
              </p>
              <button onClick={handleGoogle} style={btnStyle("#1a73e8")}>
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
              <button onClick={handleEmail} style={btnStyle(isRegister ? "#2e7d32" : "#1a73e8")}>
                {isRegister ? "Create Account" : "Sign In"}
              </button>
              <p style={{ textAlign: "center", marginTop: 16, color: "#666", fontSize: 14 }}>
                {isRegister ? "Already have an account? " : "New user? "}
                <span onClick={() => setIsRegister(!isRegister)}
                  style={{ color: "#1a73e8", cursor: "pointer", fontWeight: "bold" }}>
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
                  <button onClick={sendOTP} style={btnStyle("#e65100")}>Send OTP</button>
                </>
              ) : (
                <>
                  <p style={{ color: "#2e7d32", fontWeight: "bold" }}>OTP sent to {phone}</p>
                  <input placeholder="Enter OTP" value={otp}
                    onChange={e => setOtp(e.target.value)} style={inputStyle} />
                  <button onClick={verifyOTP} style={btnStyle("#2e7d32")}>Verify OTP</button>
                </>
              )}
            </div>
          )}
          {error && (
            <div style={{ marginTop: 16, padding: 12, background: "#ffebee",
              borderRadius: 8, color: "#c62828", fontSize: 13 }}>
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ChatBox({ roomId, userId, otherUser, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const clientRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      onConnect: () => {
        client.subscribe("/topic/chat/" + roomId, (msg) => {
          const data = JSON.parse(msg.body);
          setMessages(prev => [...prev, data]);
        });
      }
    });
    client.activate();
    clientRef.current = client;
    return () => client.deactivate();
  }, [roomId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMsg = () => {
    if (!input.trim()) return;
    clientRef.current.publish({
      destination: "/app/chat.send",
      body: JSON.stringify({ roomId, senderId: userId, content: input, type: "CHAT" })
    });
    setInput("");
  };

  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, width: 340,
      background: "white", borderRadius: 16, boxShadow: "0 8px 40px rgba(0,0,0,0.2)",
      display: "flex", flexDirection: "column", zIndex: 1000 }}>
      <div style={{ background: "#1a73e8", padding: "14px 16px", borderRadius: "16px 16px 0 0",
        display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ color: "white", fontWeight: "bold" }}>Chat with {otherUser}</div>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>Trade matched!</div>
        </div>
        <button onClick={onClose}
          style={{ background: "none", border: "none", color: "white",
            fontSize: 20, cursor: "pointer" }}>x</button>
      </div>
      <div style={{ height: 260, overflowY: "auto", padding: 12, display: "flex",
        flexDirection: "column", gap: 8 }}>
        {messages.length === 0 && (
          <p style={{ color: "#999", textAlign: "center", fontSize: 13, marginTop: 80 }}>
            Say hello to your trade partner!
          </p>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{
            alignSelf: m.senderId === userId ? "flex-end" : "flex-start",
            background: m.senderId === userId ? "#1a73e8" : "#f0f4f8",
            color: m.senderId === userId ? "white" : "#333",
            padding: "8px 12px", borderRadius: 12, maxWidth: "75%", fontSize: 14
          }}>
            {m.content}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div style={{ padding: 12, borderTop: "1px solid #eee", display: "flex", gap: 8 }}>
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMsg()}
          placeholder="Type a message..."
          style={{ flex: 1, padding: "8px 12px", borderRadius: 8,
            border: "1px solid #ddd", fontSize: 14 }} />
        <button onClick={sendMsg}
          style={{ background: "#1a73e8", color: "white", border: "none",
            borderRadius: 8, padding: "8px 14px", cursor: "pointer", fontWeight: "bold" }}>
          Send
        </button>
      </div>
    </div>
  );
}

function Dashboard({ userId, onLogout }) {
  const [type, setType] = useState("BUY");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [trades, setTrades] = useState([]);
  const [buyOrders, setBuyOrders] = useState([]);
  const [sellOrders, setSellOrders] = useState([]);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("trade");
  const [chatRoom, setChatRoom] = useState(null);
  const [matchAlert, setMatchAlert] = useState(null);
  const stompRef = useRef(null);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      onConnect: () => {
        client.subscribe("/topic/alerts/" + userId, (msg) => {
          const data = JSON.parse(msg.body);
          if (data.type === "MATCH_ALERT") {
            setMatchAlert(data);
            setChatRoom(data);
          }
        });
      }
    });
    client.activate();
    stompRef.current = client;
    return () => client.deactivate();
  }, [userId]);

  const fetchAll = async () => {
    try {
      const t = await fetch("http://localhost:8080/api/trades");
      setTrades(await t.json());
      const b = await fetch("http://localhost:8080/api/orders/buy");
      setBuyOrders(await b.json());
      const s = await fetch("http://localhost:8080/api/orders/sell");
      setSellOrders(await s.json());
    } catch (e) { console.log("Server not running"); }
  };

  useEffect(() => { fetchAll(); }, []);

  const placeOrder = async () => {
    if (!price || !quantity) return;
    try {
      const res = await fetch("http://localhost:8080/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, type, price: parseFloat(price), quantity: parseInt(quantity) }),
      });
      const msg = await res.text();
      setMessage(msg);
      setPrice(""); setQuantity("");
      fetchAll();
    } catch (e) { setMessage("Error: Spring Boot server not running!"); }
  };

  const tabStyle = (t) => ({
    padding: "10px 24px", border: "none", cursor: "pointer", fontWeight: "bold",
    borderBottom: activeTab === t ? "3px solid #1a73e8" : "3px solid transparent",
    background: "none", color: activeTab === t ? "#1a73e8" : "#666", fontSize: 15
  });

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4f8" }}>
      <div style={{ background: "#1a73e8", padding: "14px 32px",
        display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ color: "white", margin: 0 }}>TradeConnect</h2>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ color: "white" }}>{userId}</span>
          <button onClick={onLogout}
            style={{ background: "rgba(255,255,255,0.2)", color: "white", border: "none",
              padding: "8px 16px", borderRadius: 8, cursor: "pointer" }}>
            Logout
          </button>
        </div>
      </div>

      {matchAlert && (
        <div style={{ background: "#e8f5e9", border: "1px solid #a5d6a7",
          padding: "14px 24px", display: "flex", justifyContent: "space-between",
          alignItems: "center" }}>
          <span style={{ color: "#2e7d32", fontWeight: "bold" }}>
            Trade Matched! {matchAlert.content}
          </span>
          <button onClick={() => setMatchAlert(null)}
            style={{ background: "none", border: "none", cursor: "pointer",
              color: "#2e7d32", fontSize: 18 }}>x</button>
        </div>
      )}

      <div style={{ maxWidth: 900, margin: "32px auto", padding: "0 16px" }}>
        <div style={{ background: "white", borderRadius: 12, marginBottom: 24,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)", padding: "0 16px" }}>
          <button style={tabStyle("trade")} onClick={() => setActiveTab("trade")}>Place Order</button>
          <button style={tabStyle("book")} onClick={() => setActiveTab("book")}>Order Book</button>
          <button style={tabStyle("history")} onClick={() => setActiveTab("history")}>Trade History</button>
        </div>

        {activeTab === "trade" && (
          <div style={{ background: "white", borderRadius: 12, padding: 32,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <h2 style={{ marginTop: 0 }}>Place New Order</h2>
            <div style={{ display: "flex", marginBottom: 24, borderRadius: 8,
              overflow: "hidden", border: "1px solid #ddd" }}>
              <button onClick={() => setType("BUY")}
                style={{ flex: 1, padding: 14, border: "none", cursor: "pointer",
                  fontWeight: "bold", fontSize: 15,
                  background: type === "BUY" ? "#1a73e8" : "white",
                  color: type === "BUY" ? "white" : "#666" }}>BUY</button>
              <button onClick={() => setType("SELL")}
                style={{ flex: 1, padding: 14, border: "none", cursor: "pointer",
                  fontWeight: "bold", fontSize: 15,
                  background: type === "SELL" ? "#e53935" : "white",
                  color: type === "SELL" ? "white" : "#666" }}>SELL</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={{ display: "block", marginBottom: 6, fontWeight: "bold", color: "#555" }}>Price (Rs.)</label>
                <input placeholder="e.g. 202" value={price} type="number"
                  onChange={e => setPrice(e.target.value)}
                  style={{ width: "100%", padding: 12, borderRadius: 8,
                    border: "1px solid #ddd", fontSize: 16, boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: 6, fontWeight: "bold", color: "#555" }}>Quantity</label>
                <input placeholder="e.g. 100" value={quantity} type="number"
                  onChange={e => setQuantity(e.target.value)}
                  style={{ width: "100%", padding: 12, borderRadius: 8,
                    border: "1px solid #ddd", fontSize: 16, boxSizing: "border-box" }} />
              </div>
            </div>
            <button onClick={placeOrder}
              style={{ width: "100%", padding: 16, marginTop: 24, border: "none",
                borderRadius: 8, fontSize: 18, fontWeight: "bold", cursor: "pointer",
                background: type === "BUY" ? "#1a73e8" : "#e53935", color: "white" }}>
              Place {type} Order
            </button>
            {message && (
              <div style={{ marginTop: 16, padding: 14, background: "#e8f5e9",
                borderRadius: 8, color: "#2e7d32", fontWeight: "bold" }}>
                {message}
              </div>
            )}
          </div>
        )}

        {activeTab === "book" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ background: "white", borderRadius: 12, padding: 24,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
              <h3 style={{ color: "#1a73e8", marginTop: 0 }}>BUY Orders</h3>
              {buyOrders.length === 0 ? <p style={{ color: "#999" }}>No buy orders</p> :
                buyOrders.map((o, i) => (
                  <div key={i} style={{ padding: "10px 0", borderBottom: "1px solid #f0f0f0" }}>
                    <span style={{ fontWeight: "bold" }}>Rs.{o.price}</span>
                    <span style={{ color: "#666", marginLeft: 8 }}>Qty: {o.quantity}</span>
                    <span style={{ color: "#999", marginLeft: 8, fontSize: 13 }}>@{o.userId}</span>
                  </div>
                ))}
            </div>
            <div style={{ background: "white", borderRadius: 12, padding: 24,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
              <h3 style={{ color: "#e53935", marginTop: 0 }}>SELL Orders</h3>
              {sellOrders.length === 0 ? <p style={{ color: "#999" }}>No sell orders</p> :
                sellOrders.map((o, i) => (
                  <div key={i} style={{ padding: "10px 0", borderBottom: "1px solid #f0f0f0" }}>
                    <span style={{ fontWeight: "bold" }}>Rs.{o.price}</span>
                    <span style={{ color: "#666", marginLeft: 8 }}>Qty: {o.quantity}</span>
                    <span style={{ color: "#999", marginLeft: 8, fontSize: 13 }}>@{o.userId}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div style={{ background: "white", borderRadius: 12, padding: 32,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ marginTop: 0 }}>Trade History</h2>
              <button onClick={fetchAll}
                style={{ background: "#f0f4f8", border: "none", padding: "8px 16px",
                  borderRadius: 8, cursor: "pointer" }}>Refresh</button>
            </div>
            {trades.length === 0 ? <p style={{ color: "#999" }}>No trades yet.</p> :
              trades.map((t, i) => (
                <div key={i} style={{ padding: 16, marginBottom: 8, background: "#e8f5e9",
                  borderRadius: 8, color: "#2e7d32", fontWeight: "bold" }}>
                  {t}
                </div>
              ))}
          </div>
        )}
      </div>

      {chatRoom && (
        <ChatBox
          roomId={chatRoom.roomId}
          userId={userId}
          otherUser={chatRoom.content.includes("with") ?
            chatRoom.content.split("with ")[1].split("!")[0] : "Trade Partner"}
          onClose={() => setChatRoom(null)}
        />
      )}
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  return user ? (
    <Dashboard userId={user} onLogout={() => { signOut(auth); setUser(null); }} />
  ) : <Login onLogin={setUser} />;
}

export default App;