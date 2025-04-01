
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Header } from "@/components/layout/Header";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <LanguageProvider>
      <Header />
      <Component {...pageProps} />
    </LanguageProvider>
  );
}
