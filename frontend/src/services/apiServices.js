import axios from 'axios';

// Replace with your real live server endpoint string
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/admin-settings';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // Uncomment if using authentication tokens
    // 'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
  }
});

export const cmsAPI = {
  // About Page Handlers
  saveAboutHero: async (data) => {
    const res = await apiClient.post('/about/hero', data);
    return res.data;
  },
  saveAboutPillars: async (pillarsArray) => {
    const res = await apiClient.post('/about/pillars', { pillars: pillarsArray });
    return res.data;
  },
  saveAboutCouncil: async (councilArray) => {
    const res = await apiClient.post('/about/council', { council: councilArray });
    return res.data;
  },

  // Blog Journal Page Handlers
  saveBlogMeta: async (data) => {
    const res = await apiClient.post('/blog/meta', data);
    return res.data;
  },
  saveBlogPost: async (postId, postData) => {
    const res = await apiClient.put(`/blog/posts/${postId}`, postData);
    return res.data;
  },
  deleteBlogPost: async (postId) => {
    const res = await apiClient.delete(`/blog/posts/${postId}`);
    return res.data;
  },

  // Contact Settings Handlers
  saveContactDetails: async (data) => {
    const res = await apiClient.post('/contact/details', data);
    return res.data;
  },
  deleteContactMessage: async (messageId) => {
    const res = await apiClient.delete(`/contact/messages/${messageId}`);
    return res.data;
  },

  // Terms and Privacy Handlers
  saveTermsMeta: async (data) => {
    const res = await apiClient.post('/terms/meta', data);
    return res.data;
  },
  saveTermsClause: async (clauseId, clauseData) => {
    const res = await apiClient.put(`/terms/clauses/${clauseId}`, clauseData);
    return res.data;
  },
  deleteTermsClause: async (clauseId) => {
    const res = await apiClient.delete(`/terms/clauses/${clauseId}`);
    return res.data;
  },
  saveTermsSidebar: async (data) => {
    const res = await apiClient.post('/terms/sidebar', data);
    return res.data;
  },

   getAboutData: async () => {
    const res = await apiClient.get('/about');
    return res.data; 
  },
  getBlogData: async () => {
    const res = await apiClient.get('/blog');
    return res.data;
  },
  getContactData: async () => {
    const res = await apiClient.get('/contact');
    return res.data;
  },
  getTermsData: async () => {
    const res = await apiClient.get('/terms');
    return res.data;
  },
  getFaqData: async () => {
    const res = await apiClient.get('/faq');
    return res.data;
  },

  // FAQ Page Handlers
  saveFaqMeta: async (data) => {
    const res = await apiClient.post('/faq/meta', data);
    return res.data;
  },
  saveFaqItem: async (faqId, faqData) => {
    const res = await apiClient.put(`/faq/items/${faqId}`, faqData);
    return res.data;
  },
  deleteFaqItem: async (faqId) => {
    const res = await apiClient.delete(`/faq/items/${faqId}`);
    return res.data;
  }
};


