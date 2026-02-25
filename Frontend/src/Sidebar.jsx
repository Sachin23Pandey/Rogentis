
import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";

function Sidebar() {
  const {
    allThreads,
    setAllThreads,
    currThreadId,
    setNewChat,
    setPrompt,
    setReply,
    setCurrThreadId,
    setPrevChats,
    mobileSidebarOpen,        
    setMobileSidebarOpen,    
  } = useContext(MyContext);

  const getAllThreads = async () => {
    try {
      const response = await fetch("https://rogentis.onrender.com/api/thread");
      const res = await response.json();

      const filteredData = res.map((thread) => ({
        threadId: thread.threadId,
        title: thread.title,
      }));

      setAllThreads(filteredData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, [currThreadId]);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
    setMobileSidebarOpen(false); 
  };

  const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);

    try {
      const response = await fetch(
        `https://rogentis.onrender.com/api/thread/${newThreadId}`
      );
      const res = await response.json();

      setPrevChats(res);
      setNewChat(false);
      setReply(null);
      setMobileSidebarOpen(false); 
    } catch (err) {
      console.log(err);
    }
  };

  const deleteThread = async (threadId) => {
    try {
      const response = await fetch(
        `https://rogentis.onrender.com/api/thread/${threadId}`,
        { method: "DELETE" }
      );
      const res = await response.json();
      console.log(res);

      setAllThreads((prev) =>
        prev.filter((thread) => thread.threadId !== threadId)
      );

      if (threadId === currThreadId) {
        createNewChat();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {/* ✅ OVERLAY (Mobile Only) */}
      {mobileSidebarOpen && (
        <div
          className="sidebarOverlay"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* ✅ SIDEBAR */}
      <section className={`sidebar ${mobileSidebarOpen ? "open" : ""}`}>

        {/* ===== LOGO SECTION ===== */}
        <div className="sidebar-logo">
          <div className="brand">
            <div className="logo-icon">
              <i className="fa-solid fa-wand-magic-sparkles"></i>
            </div>
            <h2 className="logo-text">Rogentis</h2>
          </div>

          {/* ✅ CLOSE BUTTON (Mobile Only) */}
          <div
            className="closeSidebar"
            onClick={() => setMobileSidebarOpen(false)}
          >
            <i className="fa-solid fa-xmark"></i>
          </div>
        </div>

        {/* ===== NEW CHAT BUTTON ===== */}
        <button onClick={createNewChat} className="newChat">
          <span>
            <i className="fa-regular fa-pen-to-square"></i>New chat
          </span>
        </button>

        {/* ===== CHAT HISTORY ===== */}
        <div className="sidebar-content">
          <div className="section-title">Your Chats History</div>
          <ul className="history">
            {allThreads?.map((thread, idx) => (
              <li
                key={idx}
                onClick={() => changeThread(thread.threadId)}
                className={
                  thread.threadId === currThreadId ? "highlighted" : ""
                }
              >
                {thread.title}
                <i
                  className="fa-solid fa-trash"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteThread(thread.threadId);
                  }}
                ></i>
              </li>
            ))}
          </ul>
        </div>

        {/* ===== FOOTER ===== */}
        <div className="sign">
          <p>By @Sachin Pandey &hearts;</p>
        </div>

      </section>
    </>
  );
}

export default Sidebar;