import { useEffect, useState } from "react";

export default function App() {
  const [msg, setMsg] = useState("…");

  useEffect(() => {
    (async () => {
      const res = await window.api.ping();
      setMsg(res);
    })();
  }, []);

  return (
    <main style={{ fontFamily: "system-ui, sans-serif", padding: 24 }}>
      <h1>Electron + React + TypeScript</h1>
      <p>Preload says: <strong>{msg}</strong></p>
      <p>
        This is a minimal scaffold. Edit <code>src/App.tsx</code> and{" "}
        <code>electron/main.ts</code> to get rolling.
      </p>
      <p>OOOOOH BIG STREEETCH</p>
    </main>
  );
}