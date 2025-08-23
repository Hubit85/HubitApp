import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { SupabaseAuthProvider } from "@/contexts/SupabaseAuthContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SupabaseAuthProvider>
      <LanguageProvider>
        <Component {...pageProps} />
      </LanguageProvider>
    </SupabaseAuthProvider>
  )
}
