import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       refetchOnWindowFocus: true, // Opcjonalne: Wyłącz automatyczne ponowne wczytywanie w przypadku zmiany fokusu.
//       staleTime: 1000 * 10,
//     },
//   },
// });

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* <QueryClientProvider client={queryClient}> */}
      <App />
    {/* </QueryClientProvider> */}
  </React.StrictMode>
);
