
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "next-themes";
import App from "./app/App.tsx";
import "./styles/index.css";

const normalizeApiUrl = (url: string) => {
  return url.replace("http://127.0.0.1:8000", "");
};

const originalFetch = window.fetch.bind(window);
window.fetch = (input, init) => {
  if (typeof input === "string") {
    return originalFetch(normalizeApiUrl(input), init);
  }

  if (input instanceof URL) {
    return originalFetch(new URL(normalizeApiUrl(input.toString()), window.location.origin), init);
  }

  return originalFetch(input, init);
};

createRoot(document.getElementById("root")!).render(
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="csu-career-hub-theme">
    <App />
  </ThemeProvider>,
);
  
