import axios from "axios";

const API = "http://localhost:5000/api/messages";

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const getConversations = async () => {
  const res = await axios.get(API, {
    headers: authHeaders(),
  });
  return res.data;
};

export const getMessages = async (conversationId) => {
  const res = await axios.get(`${API}/${conversationId}/messages`, {
    headers: authHeaders(),
  });
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
