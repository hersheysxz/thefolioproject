import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import "../styles/MessagesPage.css";

const MessagesPage = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [tab, setTab] = useState("contacts");
  const [loading, setLoading] = useState(true);
  const [selectedThread, setSelectedThread] = useState(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        if (tab === "contacts") {
          const [inbox, sent] = await Promise.all([
            API.get("/messages/inbox"),
            API.get("/messages/sent"),
          ]);
          setMessages([...inbox.data, ...sent.data]);
        } else {
          const res = await API.get(`/messages/${tab}`);
          setMessages(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch messages", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [tab]);

  const getConversationThreads = () => {
    const threads = {};

    messages.forEach((msg) => {
      const threadId = msg.parentMessage || msg._id;
      if (!threads[threadId]) {
        threads[threadId] = [];
      }
      threads[threadId].push(msg);
    });

    return Object.values(threads).sort((a, b) => {
      const aTime = Math.max(...a.map((m) => new Date(m.createdAt)));
      const bTime = Math.max(...b.map((m) => new Date(m.createdAt)));
      return bTime - aTime;
    });
  };

  const markAsRead = async (id) => {
    try {
      await API.put(`/messages/${id}/read`);
      setMessages((currentMessages) =>
        currentMessages.map((msg) =>
          msg._id === id ? { ...msg, isRead: true } : msg
        )
      );
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) {
      return;
    }

    try {
      await API.delete(`/messages/${id}`);
      setMessages((currentMessages) =>
        currentMessages.filter((msg) => msg._id !== id)
      );
      setSelectedThread(null);
    } catch (error) {
      console.error("Failed to delete message", error);
    }
  };

  const fetchMessagesAfterSend = async () => {
    try {
      const [inbox, sent] = await Promise.all([
        API.get("/messages/inbox"),
        API.get("/messages/sent"),
      ]);
      setMessages([...inbox.data, ...sent.data]);
    } catch (error) {
      console.error("Failed to refresh messages:", error);
    }
  };

  const sendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedThread) return;

    try {
      const rootMessage = selectedThread[0];
      await API.post("/messages", {
        recipient:
          rootMessage.sender._id === user._id
            ? rootMessage.recipient._id
            : rootMessage.sender._id,
        subject: `Re: ${rootMessage.subject}`,
        body: replyText,
        parentMessage: rootMessage._id,
      });
      setReplyText("");
      await fetchMessagesAfterSend();
    } catch (error) {
      console.error("Failed to send reply:", error);
      alert("Failed to send reply");
    }
  };

  if (!user) {
    return <div className="messages-page"><div className="messages-login">Please log in to view messages.</div></div>;
  }

  const threads = tab === "contacts" ? getConversationThreads() : [];

  return (
    <div className="messages-page">
      <div className="messages-shell">
        <section className="messages-hero">
          <h2>Messages</h2>
          <p>
            Keep track of conversations, review sent notes, and reply to active
            threads in one place.
          </p>
        </section>

        <div className="messages-tabs-wrap">
          <div className="message-tabs">
            <button
              onClick={() => setTab("contacts")}
              className={tab === "contacts" ? "active" : ""}
            >
              Conversations
            </button>
            <button
              onClick={() => setTab("inbox")}
              className={tab === "inbox" ? "active" : ""}
            >
              Inbox
            </button>
            <button
              onClick={() => setTab("sent")}
              className={tab === "sent" ? "active" : ""}
            >
              Sent
            </button>
          </div>
        </div>

        {loading ? (
          <div className="messages-loading">Loading messages...</div>
        ) : tab === "contacts" ? (
          <div className="contacts-container">
            <div className="threads-container-full">
              <h3>Your Conversations</h3>
              {threads.length === 0 ? (
                <div className="messages-empty">
                  No conversations yet. Start by sending or receiving a message.
                </div>
              ) : (
                threads.map((thread, idx) => {
                  const rootMsg = thread[0];
                  const hasReplies = thread.length > 1;
                  return (
                    <div
                      key={idx}
                      className={`thread-preview ${
                        selectedThread === thread ? "selected" : ""
                      }`}
                      onClick={() => {
                        setSelectedThread(thread);
                        thread.forEach((msg) => {
                          if (!msg.isRead && msg.recipient._id === user._id) {
                            markAsRead(msg._id);
                          }
                        });
                      }}
                    >
                      <div className="thread-header">
                        <h4>{rootMsg.subject}</h4>
                        {hasReplies ? (
                          <span className="reply-badge">Admin replied</span>
                        ) : null}
                      </div>
                      <p className="thread-preview-text">
                        {rootMsg.body.substring(0, 100)}...
                      </p>
                      <small>{new Date(rootMsg.createdAt).toLocaleString()}</small>
                    </div>
                  );
                })
              )}
            </div>

            {selectedThread ? (
              <div className="thread-detail-panel">
                <div className="thread-messages">
                  <h3>{selectedThread[0].subject}</h3>
                  {selectedThread.map((msg) => (
                    <div
                      key={msg._id}
                      className={`message-bubble ${
                        msg.sender._id === user._id ? "sent" : "received"
                      }`}
                    >
                      <div className="msg-meta">
                        <strong>{msg.sender?.name || "You"}</strong>
                        <small>{new Date(msg.createdAt).toLocaleString()}</small>
                      </div>
                      <p>{msg.body}</p>
                      <button
                        className="btn-delete"
                        onClick={() => deleteMessage(msg._id)}
                        type="button"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>

                <form onSubmit={sendReply} className="reply-form">
                  <textarea
                    placeholder="Type your reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows="3"
                  />
                  <button type="submit" disabled={!replyText.trim()}>
                    Send Reply
                  </button>
                </form>
              </div>
            ) : (
              <div className="thread-detail-panel">
                <div className="messages-empty">
                  Select a conversation to read the thread and send a reply.
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="messages-list-wrap">
            <div className="messages-list">
              {messages.length === 0 ? (
                <div className="messages-empty">No messages in this view.</div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`message-item ${!msg.isRead ? "unread" : ""}`}
                  >
                    <h3>{msg.subject}</h3>
                    <p>From: {msg.sender?.name || "Admin"}</p>
                    <p>{msg.body}</p>
                    <small>{new Date(msg.createdAt).toLocaleString()}</small>
                    <div className="message-actions">
                      {tab === "inbox" && !msg.isRead ? (
                        <button onClick={() => markAsRead(msg._id)} type="button">
                          Mark as Read
                        </button>
                      ) : null}
                      <button onClick={() => deleteMessage(msg._id)} type="button">
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
