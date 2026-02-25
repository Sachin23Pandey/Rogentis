

import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect, useRef } from "react";
import { PropagateLoader } from "react-spinners";

function ChatWindow() {
  const {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    prevChats,
    setPrevChats,
    setNewChat,
    theme,
    setTheme,
    mobileSidebarOpen,          // ✅ NEW
    setMobileSidebarOpen,       // ✅ NEW
  } = useContext(MyContext);

  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const bottomRef = useRef(null);

  const getReply = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setNewChat(false);

    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: prompt,
        threadId: currThreadId,
      }),
    };

    try {
      const response = await fetch("http://localhost:5000/api/chat", options);
      const res = await response.json();
      setReply(res.reply);
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (prompt && reply) {
      setPrevChats((prev) => [
        ...prev,
        { role: "user", content: prompt },
        { role: "assistant", content: reply },
      ]);
    }
    setPrompt("");
  }, [reply]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [prevChats, loading]);

  return (
    <div className="chatWindow">

      {/* ================= NAVBAR ================= */}
      <div className="navbar">

        {/* ✅ HAMBURGER ICON (Mobile Only) */}
        <div
          className="mobileMenuIcon"
          onClick={() => setMobileSidebarOpen(true)}
        >
          <i className="fa-solid fa-bars"></i>
        </div>

        <button>
          <i className="fa-solid fa-wand-magic-sparkles"></i>
          Rogentis
        </button>

        {/* THEME DROPDOWN */}
        <div className="themeWrapper">
          <div
            className="toggleButton"
            onClick={() => setIsOpen(!isOpen)}
          >
            <i className={`fa-solid ${theme === "dark" ? "fa-moon" : "fa-sun"}`}></i>
          </div>

          {isOpen && (
            <div className="themeDropdown">
              <div
                className={`themeOption ${theme === "dark" ? "active" : ""}`}
                onClick={() => {
                  setTheme("dark");
                  setIsOpen(false);
                }}
              >
                <i className="fa-solid fa-moon"></i>
                <span>Dark Mode</span>
              </div>

              <div
                className={`themeOption ${theme === "light" ? "active" : ""}`}
                onClick={() => {
                  setTheme("light");
                  setIsOpen(false);
                }}
              >
                <i className="fa-solid fa-sun"></i>
                <span>Light Mode</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= CHAT BODY ================= */}
      <div className="chatBody">
        <Chat />

        {loading && (
          <div className="loaderWrapper">
            <div className="loaderBubble">
              <PropagateLoader color="#fff" size={8} />
            </div>
          </div>
        )}

        <div ref={bottomRef}></div>
      </div>

      {/* ================= INPUT ================= */}
      <div className="chatInput">
        <div className="inputBox">
          <input
            placeholder="Ask anything..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && getReply()}
          />
          <div id="submit" onClick={getReply}>
            <i className="fa-solid fa-paper-plane"></i>
          </div>
        </div>
        <p className="info">
         Rogentis strives for accuracy, but independent verification is advised.
        </p>
      </div>

    </div>
  );
}

export default ChatWindow;