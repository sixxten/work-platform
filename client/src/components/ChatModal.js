import React, { useState, useEffect, useRef } from "react";
import chatService from "../services/chatService";

function ChatModal({ chatId, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [chat, setChat] = useState(null);
  const messagesEndRef = useRef(null);

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
    } catch (err) {
      console.error("Ошибка отправки:", err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU');
  };

  const getAvatar = (senderId) => {
    if (!chat) return "?";
    if (senderId === chat.studentId) return "S";
    return "E";
  };

  const getAvatarColor = (senderId) => {
    if (!chat) return "#6c757d";
    if (senderId === chat.studentId) return "#28a745";
    return "#007bff";
  };

  const getSenderName = (senderId) => {
    if (!chat) return "";
    if (senderId === chat.studentId) return chat.student?.email || "Студент";
    return chat.employer?.email || "Работодатель";
  };

  if (loading) return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <div style={{ backgroundColor: "white", padding: "20px" }}>
        Загрузка...
      </div>
    </div>
  );

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: "white",
        padding: "20px",
        maxWidth: "500px",
        width: "90%",
        height: "70vh",
        display: "flex",
        flexDirection: "column",
        borderRadius: "8px"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
          <h2 style={{ margin: 0 }}>Чат: {chat?.vacancy?.title}</h2>
          <button onClick={onClose} style={{ fontSize: "20px", cursor: "pointer" }}>✕</button>
        </div>
        
        <div style={{ flex: 1, overflowY: "auto", marginBottom: "10px" }}>
          {messages.map(msg => {
            const isCurrentUser = msg.senderId === chatService.getCurrentUserId();
            const avatar = getAvatar(msg.senderId);
            const avatarColor = getAvatarColor(msg.senderId);
            
            return (
              <div key={msg.id} style={{
                display: "flex",
                justifyContent: isCurrentUser ? "flex-end" : "flex-start",
                marginBottom: "15px"
              }}>
                {!isCurrentUser && (
                  <div style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    backgroundColor: avatarColor,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "white",
                    fontWeight: "bold",
                    marginRight: "10px",
                    flexShrink: 0
                  }}>
                    {avatar}
                  </div>
                )}
                
                <div style={{
                  maxWidth: "70%"
                }}>
                  {!isCurrentUser && (
                    <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>
                      {getSenderName(msg.senderId)}
                    </div>
                  )}
                  <div style={{
                    backgroundColor: isCurrentUser ? "#007bff" : "#e9ecef",
                    color: isCurrentUser ? "white" : "black",
                    padding: "10px 12px",
                    borderRadius: "12px",
                    wordWrap: "break-word"
                  }}>
                    {msg.content}
                  </div>
                  <div style={{ fontSize: "10px", color: "gray", marginTop: "4px", textAlign: isCurrentUser ? "right" : "left" }}>
                    {formatDate(msg.createdAt)}
                  </div>
                </div>
                
                {isCurrentUser && (
                  <div style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    backgroundColor: avatarColor,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "white",
                    fontWeight: "bold",
                    marginLeft: "10px",
                    flexShrink: 0
                  }}>
                    {avatar}
                  </div>
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
        
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            style={{ flex: 1, padding: "10px", borderRadius: "4px", border: "1px solid #ddd" }}
            placeholder="Введите сообщение..."
          />
          <button onClick={handleSend} style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}>
            Отправить
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatModal;