import axios from "axios";

// Base URL for your backend API
const baseURL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

// Create a reusable axios instance
const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ==========================
   Member APIs
========================== */

// Get all members
export const getMembers = () => api.get("/members");

// Get a single member by ID
export const getMemberById = (memberId) => api.get(`/members/${memberId}`);

// Create a new member
export const createMember = (memberData) => api.post("/members", memberData);

// Update an existing member
export const updateMember = (memberId, memberData) =>
  api.put(`/members/${memberId}`, memberData);

// Delete a member
export const deleteMember = (memberId) => api.delete(`/members/${memberId}`);

/* ==========================
   Game APIs
========================== */

// Get all games
export const getGames = () => api.get("/games");

// Get a single game by ID
export const getGameById = (gameId) => api.get(`/games/${gameId}`);

// Create a new game
export const createGame = (gameData) => api.post("/games", gameData);

// Update an existing game
export const updateGame = (gameId, gameData) =>
  api.put(`/games/${gameId}`, gameData);

// Delete a game
export const deleteGame = (gameId) => api.delete(`/games/${gameId}`);

/* ==========================
   Recharge APIs
========================== */

// Create a new recharge
export const createRecharge = (rechargeData) =>
  api.post("/recharges", rechargeData);

// Get all recharges
export const getRecharges = () => api.get("/recharges");

// Get recharges by member
export const getRechargesByMember = (memberId) =>
  api.get(`/recharges/member/${memberId}`);

/* ==========================
   Transaction APIs
========================== */

// Get all transactions
export const getTransactions = () => api.get("/transactions");

// Get a single transaction by ID
export const getTransactionById = (transactionId) =>
  api.get(`/transactions/${transactionId}`);

/* ==========================
   Daily Collection APIs
========================== */

// Get all daily collections
export const getDailyCollections = () => api.get("/daily-collections");

// Get collection for a specific date (YYYY-MM-DD)
export const getDailyCollectionByDate = (date) =>
  api.get(`/daily-collections/${date}`);

// Export default axios instance in case you want raw requests
export default api;