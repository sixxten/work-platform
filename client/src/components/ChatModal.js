import React, { useState, useEffect, useRef } from "react";
import chatService from "../services/chatService";

function ChatModal({ chatId, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [chat, setChat] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const chats = await chatService.getMyChats();
        const currentChat = chats.find(c => c.id === chatId);
        setChat(currentChat);
      } catch (err) {
        console.error(err);
      }
    };
    fetchChat();
  }, [chatId]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await chatService.getMessages(chatId);
        setMessages(data);
      } catch (err) {
        console.error("Ошибка загрузки сообщений:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    try {
      const message = await chatService.sendMessage(chatId, newMessage);
      setMessages([...messages, message]);
      setNewMessage("");
      inputRef.current?.focus();
    } catch (err) {
      console.error("Ошибка отправки:", err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 250);
  };

  const getAvatarColor = (senderId) => {
    if (!chat) return "#3b82f6";
    if (senderId === chat.studentId) return "#10b981";
    return "#3b82f6";
  };

  const getInitial = (senderId) => {
    if (!chat) return "?";
    if (senderId === chat.studentId) return "S";
    return "E";
  };

  const getSenderName = (senderId) => {
    if (!chat) return "";
    if (senderId === chat.studentId) return "student";
    return "employer";
  };

  if (loading) return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.4)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1050
    }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Загрузка...</span>
      </div>
    </div>
  );

  return (
    <>
      <div 
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.4)",
          zIndex: 1049,
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.25s ease-out"
        }}
        onClick={handleClose}
      />
      
      <div style={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        width: "450px",
        backgroundColor: "white",
        boxShadow: "-4px 0 25px rgba(0,0,0,0.15)",
        display: "flex",
        flexDirection: "column",
        zIndex: 1050,
        transform: isVisible ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.35s cubic-bezier(0.34, 1.2, 0.64, 1)"
      }}>
        <div style={{ 
          padding: "16px 20px", 
          borderBottom: "1px solid #e9ecef",
          backgroundColor: "#f8fafc",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "600", color: "#0f172a" }}>
            Чат: {chat?.vacancy?.title}
          </h3>
          <button
            onClick={handleClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              color: "#64748b",
              padding: "0 8px"
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ 
          flex: 1, 
          overflowY: "auto", 
          padding: "20px",
          backgroundColor: "#ffffff"
        }}>
          {messages.map((msg) => {
            const isCurrentUser = msg.senderId === chatService.getCurrentUserId();
            
            return (
              <div key={msg.id}>
                <div style={{
                  display: "flex",
                  justifyContent: isCurrentUser ? "flex-end" : "flex-start",
                  marginBottom: "12px"
                }}>
                  {!isCurrentUser && (
                    <div style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      backgroundColor: getAvatarColor(msg.senderId),
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "14px",
                      marginRight: "10px",
                      flexShrink: 0
                    }}>
                      {getInitial(msg.senderId)}
                    </div>
                  )}
                  
                  <div style={{
                    maxWidth: "70%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: isCurrentUser ? "flex-end" : "flex-start"
                  }}>
                    {!isCurrentUser && (
                      <span style={{ fontSize: "0.7rem", color: "#64748b", marginBottom: "4px", marginLeft: "4px" }}>
                        {getSenderName(msg.senderId)}
                      </span>
                    )}
                    <div style={{
                      backgroundColor: isCurrentUser ? "#3b82f6" : "#f1f5f9",
                      color: isCurrentUser ? "white" : "#0f172a",
                      padding: "10px 14px",
                      borderRadius: "18px",
                      borderBottomRightRadius: isCurrentUser ? "4px" : "18px",
                      borderBottomLeftRadius: !isCurrentUser ? "4px" : "18px",
                      wordWrap: "break-word"
                    }}>
                      {msg.content}
                    </div>
                  </div>
                  
                  {isCurrentUser && (
                    <div style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      backgroundColor: getAvatarColor(msg.senderId),
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "14px",
                      marginLeft: "10px",
                      flexShrink: 0
                    }}>
                      {getInitial(msg.senderId)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <div style={{ 
          padding: "16px 20px", 
          borderTop: "1px solid #e9ecef",
          backgroundColor: "#ffffff"
        }}>
          <div style={{ 
            display: "flex", 
            gap: "12px",
            alignItems: "flex-end"
          }}>
            <textarea
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Сообщение..."
              rows={1}
              style={{
                flex: 1,
                padding: "10px 16px",
                borderRadius: "24px",
                border: "1px solid #e2e8f0",
                fontSize: "0.95rem",
                fontFamily: "inherit",
                resize: "none",
                outline: "none",
                maxHeight: "100px",
                overflowY: "auto"
              }}
              onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
              onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
            />
            <button
              onClick={handleSend}
              disabled={!newMessage.trim()}
              style={{
                backgroundColor: newMessage.trim() ? "#3b82f6" : "#cbd5e1",
                color: "white",
                border: "none",
                borderRadius: "40px",
                padding: "10px 20px",
                fontSize: "0.9rem",
                fontWeight: "500",
                cursor: newMessage.trim() ? "pointer" : "not-allowed",
                minWidth: "80px"
              }}
            >
              Отправить
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChatModal;