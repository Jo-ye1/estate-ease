import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Navbar from "@/components/home/Navbar";
import ChatWindow from "@/components/inbox/ChatWindow";
import { socket } from "@/lib/socket";


const INBOX_API_URL = "http://localhost:5000/api/messages";

const getInboxAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const getConversations = async () => {
  const res = await axios.get(INBOX_API_URL, {
    headers: getInboxAuthHeaders(),
  });

  return res.data;
};

export default function InboxPage() {
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  }, []);

  const loadConversations = async () => {
    try {
      const data = await getConversations();

      const safeData = Array.isArray(data)
        ? data
        : data?.conversations || [];

      setConversations(safeData);

      if (!selected && safeData.length > 0) {
        setSelected(safeData[0]);
      }
    } catch (error) {
      console.error("Failed to load conversations:", error);
      setConversations([]);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (!user?._id) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join", user._id);

    const handleNewMessage = (message) => {
      setConversations((prev) =>
        prev.map((conv) => {
          const targetConvId =
            message?.conversation?._id ||
            message?.conversation;

          if (conv._id !== targetConvId) return conv;

          return {
            ...conv,
            lastMessage:
              message?.text ||
              message?.content ||
              "New message",
            lastMessageAt: new Date().toISOString(),
          };
        })
      );
    };

    socket.on("new-message", handleNewMessage);

    return () => {
      socket.off("new-message", handleNewMessage);
    };
  }, [user?._id]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      <Navbar />

      <div className="flex flex-1 max-w-[1320px] mx-auto w-full px-4 pt-8 pb-12 gap-6">
        <div className="w-80 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl flex flex-col overflow-hidden h-[600px]">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-xs font-black uppercase tracking-wider">
              Active Threads
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="text-center py-20 text-xs font-bold">
                No threads found
              </div>
            ) : (
              conversations.map((conv) => {
                const participants = Array.isArray(
                  conv?.participants
                )
                  ? conv.participants
                  : [];

                const other =
                  participants.find(
                    (p) => (p?._id || p) !== user?._id
                  ) || {};

                const isSelected =
                  selected?._id === conv._id;

                return (
                  <button
                    key={conv._id}
                    onClick={() => setSelected(conv)}
                    className={`w-full text-left p-4 ${
                      isSelected
                        ? "bg-slate-100 dark:bg-slate-800"
                        : "hover:bg-slate-50 dark:hover:bg-slate-950"
                    }`}
                  >
                    <h4 className="font-bold">
                      {other?.name ||
                        "Property Inquiry"}
                    </h4>

                    <p className="text-xs truncate">
                      {conv?.lastMessage ||
                        "No messages"}
                    </p>
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="flex-1 h-[600px]">
          {selected ? (
            <ChatWindow
              activeConversationId={selected._id}
              currentUser={user}
            />
          ) : (
            <div className="flex h-full items-center justify-center border rounded-2xl">
              Select a conversation
            </div>
          )}
        </div>
      </div>
    </div>
  );
}