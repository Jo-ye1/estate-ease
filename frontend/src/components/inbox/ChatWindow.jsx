import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Send, MessageSquare } from "lucide-react";
import { socket } from "@/lib/socket";

const API = "http://localhost:5000/api/messages";

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const getMessages = async (conversationId) => {
  const res = await axios.get(
    `${API}/${conversationId}/messages`,
    {
      headers: authHeaders(),
    }
  );
  return res.data;
};

export const sendMessage = async (conversationId, text) => {
  const res = await axios.post(
    `${API}/${conversationId}/messages`,
    { text },
    {
      headers: authHeaders(),
    }
  );
  return res.data;
};

export const markRead = async (conversationId) => {
  const res = await axios.put(
    `${API}/${conversationId}/read`,
    {},
    {
      headers: authHeaders(),
    }
  );
  return res.data;
};

export default function ChatWindow({ activeConversationId, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const currentConversationIdString = typeof activeConversationId === "object" 
    ? activeConversationId?._id 
    : activeConversationId;

  useEffect(() => {
    if (!currentConversationIdString) return;

    const fetchChatThread = async () => {
      try {
        setLoading(true);
        const data = await getMessages(currentConversationIdString);
        const finalArray = Array.isArray(data) ? data : (data?.messages || data?.data || []);
        setMessages(finalArray);
        await markRead(currentConversationIdString);
      } catch (err) {
        console.error("Fetch thread error:", err);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChatThread();
  }, [currentConversationIdString]);

  useEffect(() => {
    if (!socket || !currentConversationIdString) return;

    const handleIncomingMessageStream = (incomingMessage) => {
      const realMessage = incomingMessage?.message || incomingMessage;
      if (!realMessage) return;

      const incomingChatThreadId = realMessage.conversation?._id || realMessage.conversation;

      if (String(incomingChatThreadId) === String(currentConversationIdString)) {
        setMessages((prev) => {
          const alreadyExists = prev.some((msg) => msg._id === realMessage._id);
          if (alreadyExists) return prev;
          return [...prev, realMessage];
        });
      }
    };

    socket.on("newMessage", handleIncomingMessageStream);

    return () => {
      socket.off("newMessage", handleIncomingMessageStream);
    };
  }, [currentConversationIdString]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const handleDispatchMessage = async () => {
    if (!newMessage.trim() || !currentConversationIdString) return;

    const textToSend = newMessage.trim();
    setNewMessage("");

    try {
      const sentData = await sendMessage(currentConversationIdString, textToSend);
      const freshMessageObj = sentData?.message || sentData?.data || sentData;

      if (freshMessageObj && typeof freshMessageObj === "object") {
        setMessages((prev) => {
          const alreadyExists = prev.some((msg) => msg._id === freshMessageObj._id);
          if (alreadyExists) return prev;
          return [...prev, freshMessageObj];
        });
      }
    } catch (err) {
      console.error("❌ CRITICAL: Message delivery failed or backend endpoint threw an error:", err?.response?.data || err.message);
      setNewMessage(textToSend);
    }
  };

  const handleKeyDownTrigger = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleDispatchMessage();
    }
  };

  const formatChatTime = (dateString) => {
    const timestamp = dateString ? new Date(dateString) : new Date();
    if (isNaN(timestamp.getTime())) return "";
    return timestamp.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  if (!currentConversationIdString) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl h-[600px] w-full">
        <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 mb-4">
          <MessageSquare size={22} />
        </div>
        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
          No Active Conversation
        </h3>
      </div>
    );
  }

  const opposingParticipant = typeof activeConversationId === "object"
    ? activeConversationId?.participants?.find(p => String(p?._id || p) !== String(currentUser?._id))
    : null;

  return (
    <div className="flex-1 flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl h-[600px] overflow-hidden shadow-2xs w-full">
      <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-black uppercase tracking-wider overflow-hidden">
            {opposingParticipant?.avatar ? (
              <img src={opposingParticipant.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <span>{opposingParticipant?.name?.substring(0, 2) || "CH"}</span>
            )}
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
              {opposingParticipant?.name || "Secure Chat Feed"}
            </h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                Active Now
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4 max-h-[460px]">
        {loading && messages.length === 0 ? (
          <div className="flex justify-center items-center py-10">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-20 text-xs font-bold text-slate-400 uppercase tracking-wider">
            Beginning of secure message thread...
          </div>
        ) : (
          messages.map((msg, index) => {
            if (!msg) return null;
            const senderId = msg.sender?._id || msg.sender;
            const isMe = String(senderId) === String(currentUser?._id);

            return (
              <div
                key={msg._id || index}
                className={`flex flex-col w-full ${isMe ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-2xl text-xs font-semibold leading-relaxed shadow-2xs ${
                    isMe
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none"
                  }`}
                >
                  {msg.text || msg.content || ""}
                </div>
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 mt-1 uppercase px-1">
                  {formatChatTime(msg.createdAt || msg.updatedAt)}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-slate-50/50 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDownTrigger}
          placeholder="Type secure chat response..."
          className="flex-1 h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors text-xs font-semibold"
        />
        <button
          type="button"
          onClick={handleDispatchMessage}
          className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}
