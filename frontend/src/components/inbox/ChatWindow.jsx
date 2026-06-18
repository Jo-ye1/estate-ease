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

export const sendMessage = async (
  conversationId,
  text
) => {
  const res = await axios.post(
    `${API}/${conversationId}/messages`,
    { text },
    {
      headers: authHeaders(),
    }
  );
  return res.data;
};

export const markRead = async (
  conversationId
) => {
  const res = await axios.put(
    `${API}/${conversationId}/read`,
    {},
    {
      headers: authHeaders(),
    }
  );
  return res.data;
};

export default function ChatWindow({
  activeConversationId,
  currentUser,
}) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] =
    useState("");
  const [loading, setLoading] =
    useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!activeConversationId) return;

    const fetchChatThread = async () => {
      try {
        setLoading(true);

        const data = await getMessages(
          activeConversationId
        );

        setMessages(
          Array.isArray(data)
            ? data
            : data?.messages || []
        );

        await markRead(activeConversationId);
      } catch (err) {
        console.error(err);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChatThread();
  }, [activeConversationId]);

  useEffect(() => {
    socket.on("receive_message", (incomingMessage) => {
      setMessages((prev) => [...prev, incomingMessage]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const handleDispatchMessage = async (e) => {
    e.preventDefault();

    if (
      !newMessage.trim() ||
      !activeConversationId
    )
      return;

    try {
      const sentData = await sendMessage(
        activeConversationId,
        newMessage.trim()
      );

      const freshMessageObj =
        sentData?.message || sentData;

      if (freshMessageObj) {
        setMessages((prev) => [
          ...prev,
          freshMessageObj,
        ]);
      }

      setNewMessage("");
    } catch (err) {
      console.error(err);
    }
  };

  if (!activeConversationId) {
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

  return (
    <div className="flex-1 flex flex-col justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl h-[600px] overflow-hidden shadow-2xs w-full">
      <div className="flex-1 overflow-y-auto p-5 space-y-4 max-h-[520px]">
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
            const senderId =
              msg.sender?._id || msg.sender;

            const isMe =
              senderId === currentUser?._id;

            return (
              <div
                key={msg._id || index}
                className={`flex w-full ${
                  isMe
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-2xl text-xs font-semibold leading-relaxed shadow-2xs ${
                    isMe
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
    
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleDispatchMessage}
        className="p-3 bg-slate-50/50 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800 flex gap-2"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) =>
            setNewMessage(e.target.value)
          }
          placeholder="Type secure chat response..."
          className="flex-1 h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-800"
        />

        <button
          type="submit"
          className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center"
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}
