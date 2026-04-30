export const ROUTES = {
  login: "/login",
  register: "/register",
  oauthRedirect: "/oauth2/redirect",
  overview: "/",
  transactions: "/transactions",
  budgets: "/budgets",
  pots: "/pots",
  recurringBills: "/recurring-bills",
  settings: "/settings",
  aiAssistant: "/ai-assistant",
  chatSession: (sessionId) => `/ai-assistant/session/${sessionId}`,

  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  categoryWiseTransaction: (categoryId) =>
    `/transactions?page=0&category=${categoryId}`,
};
