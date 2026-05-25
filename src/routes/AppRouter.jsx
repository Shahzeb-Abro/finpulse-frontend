import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ROUTES } from "./routes";
import {
  ForgotPassword,
  Login,
  OAuthRedirect,
  Register,
  ResetPassword,
} from "@/modules/public/auth";
import { DashboardLayout } from "@/layouts";
import {
  Budgets,
  Overview,
  Pots,
  RecurringBills,
  Settings,
  Transactions,
} from "@/modules/private";
import { AIAssistant } from "@/modules/private/aiAssistant";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Dashboard Routes  */}
        <Route path={ROUTES.dashboard} element={<DashboardLayout />}>
          {/* Nested dashboard routes can be defined here */}
          <Route index element={<Overview />} />
          <Route path={ROUTES.transactions} element={<Transactions />} />
          <Route path={ROUTES.budgets} element={<Budgets />} />
          <Route path={ROUTES.pots} element={<Pots />} />
          <Route path={ROUTES.recurringBills} element={<RecurringBills />} />
          <Route path={ROUTES.settings} element={<Settings />} />
          {/* <Route path="/ai-assistant" element={<AIAssistant />} />
          <Route
            path="/ai-assistant/session/:sessionId"
            element={<AIAssistant />}
          /> */}
        </Route>

        {/* Auth Routes  */}
        <Route path={ROUTES.login} element={<Login />} />
        <Route path={ROUTES.register} element={<Register />} />
        <Route path={ROUTES.oauthRedirect} element={<OAuthRedirect />} />
        <Route path={ROUTES.forgotPassword} element={<ForgotPassword />} />
        <Route path={ROUTES.resetPassword} element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
};
