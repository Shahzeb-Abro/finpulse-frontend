import { AppRouter } from "./routes/AppRouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "./components/ui/sonner";
import { IntlProvider } from "react-intl";
import { CurrencyProvider } from "./context/CurrencyContext";

function App() {
  const queryClient = new QueryClient();
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <IntlProvider locale="en" defaultLocale="en">
          <CurrencyProvider>
            <AppRouter />
          </CurrencyProvider>
          <ReactQueryDevtools />
          <Toaster position="top-right" richColors />
        </IntlProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
