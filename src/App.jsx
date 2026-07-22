import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import { BRAND_NAME, BRAND_TAGLINE } from "./brand";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";

function App() {
  const [toast, setToast] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const toastTimerRef = useRef(null);

  const showToast = useCallback((message) => {
    window.clearTimeout(toastTimerRef.current);
    setToast(message);
    toastTimerRef.current = window.setTimeout(() => setToast(""), 2400);
  }, []);

  useEffect(() => {
    return () => window.clearTimeout(toastTimerRef.current);
  }, []);

  return (
    <div className="App">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <Home searchQuery={searchQuery} showToast={showToast} />

      {toast && <div className="toast" role="status" aria-live="polite">{toast}</div>}

      <footer className="site-footer">
        <div className="container">
          <p>© {new Date().getFullYear()} {BRAND_NAME} — {BRAND_TAGLINE}</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
