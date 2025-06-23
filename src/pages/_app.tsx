import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { LanguageProvider } from "@/contexts/LanguageContext";
import MobileOptimizer from "@/components/MobileOptimizer";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <LanguageProvider>
      <MobileOptimizer enablePinchZoom={true} className="min-h-screen">
        <Component {...pageProps} />
      </MobileOptimizer>
    </LanguageProvider>
  );
}
