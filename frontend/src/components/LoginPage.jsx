import { useState, useEffect } from "react";
import { api, clearSession, saveSession } from "../lib/api";
import { WoodPanel, Parchment, PxBtn, PxInput, Divider, FarmerSprite } from "./ui";

/* ═══════════════════════════════════════════════
   LOGIN PAGE
═══════════════════════════════════════════════ */
export default function LoginPage({ onLogin, initialError = '' }) {
  const [email, setEmail]  = useState('');
  const [pass, setPass]    = useState('');
  const [name, setName]    = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [err, setErr]      = useState('');
  const [isBusy, setIsBusy] = useState(false);

  useEffect(() => {
    setErr(initialError);
  }, [initialError]);

  const submit = async () => {
    if (!email || !pass || !name) { setErr('All fields required!'); return; }
    if (pass.length < 6) { setErr('Password must be at least 6 characters.'); return; }

    setIsBusy(true);
    setErr('');

    try {
      const response = isSignup
        ? await api.signup({ name, email, password: pass })
        : await api.login({ email, password: pass });

      saveSession(response.token, name);
      // Prefer stored name → server name → typed name
      const userData = { ...response.user, name: name || response.user?.name || name };
      onLogin(userData);
    } catch (error) {
      clearSession();
      setErr(error.message);
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:16, position:'relative', zIndex:1 }}>
      <div style={{ width:'100%', maxWidth:400 }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:24 }}>
          <div style={{ fontSize:18, color:'#ffd700', letterSpacing:4, marginBottom:4 }}>✦ ✦ ✦</div>
          <div style={{ fontSize:52, color:'#ffd700', textShadow:'3px 3px 0 #e65100, 6px 6px 0 rgba(0,0,0,.4)' }}>
            AlgoQuest
          </div>
          <div style={{ fontSize:20, color:'#d7ccc8', letterSpacing:2 }}>A PIXEL DSA ADVENTURE</div>
          <div style={{ marginTop:12 }} className="anim-float">
            <FarmerSprite sz={4} />
          </div>
        </div>

        <WoodPanel>
          <Parchment style={{ marginBottom:0 }}>
            <div style={{ fontSize:26, textAlign:'center', marginBottom:16 }}>
              {isSignup ? '📜 Create Account' : '🔑 Login'}
            </div>
            <Divider />
            <div style={{ display:'flex', flexDirection:'column', gap:10, marginTop:12 }}>
              <div>
                <div style={{ fontSize:18, marginBottom:4 }}>Username</div>
                <PxInput value={name} onChange={setName} placeholder="Explorer Joe..." />
              </div>
              <div>
                <div style={{ fontSize:18, marginBottom:4 }}>Email</div>
                <PxInput value={email} onChange={setEmail} placeholder="explorer@test.com" />
              </div>
              <div>
                <div style={{ fontSize:18, marginBottom:4 }}>Password</div>
                <PxInput value={pass} onChange={setPass} placeholder="••••••••" type="password" />
              </div>
              {err && <div style={{ color:'#b71c1c', fontSize:18 }}>⚠️ {err}</div>}
              <PxBtn variant="grn" onClick={submit} disabled={isBusy} size="lg" style={{ width:'100%', justifyContent:'center', marginTop:6 }}>
                {isSignup ? '🌱 Start Adventure!' : '⚔️ Enter Quest!'}
              </PxBtn>
              <PxBtn variant="brn" disabled={isBusy} onClick={() => { setIsSignup(s => !s); setErr(''); }}
                style={{ width:'100%', justifyContent:'center', fontSize:17 }}>
                {isSignup ? 'Already an explorer? Login' : 'New explorer? Sign Up'}
              </PxBtn>
            </div>
          </Parchment>
        </WoodPanel>

        <div style={{ textAlign:'center', marginTop:12, fontSize:16, color:'#8d6e63' }}>
          ★ Master Arrays · Linked Lists · Graphs · Stacks ★
        </div>
      </div>
    </div>
  );
}
