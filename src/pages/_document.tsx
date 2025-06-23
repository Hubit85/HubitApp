import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        {/* Meta tags esenciales para compatibilidad móvil */}
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        
        {/* Viewport optimizado para iOS y todos los navegadores móviles */}
        <meta 
          name="viewport" 
          content="width=device-width, initial-scale=1.0, maximum-scale=5.0, minimum-scale=0.5, user-scalable=yes, viewport-fit=cover" 
        />
        
        {/* Meta tags específicos para iOS */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="HuBiT v4.0" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* Meta tags para PWA */}
        <meta name="application-name" content="HuBiT v4.0" />
        <meta name="theme-color" content="#8B5A3C" />
        <meta name="msapplication-TileColor" content="#8B5A3C" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Meta tags para SEO y compatibilidad */}
        <meta name="description" content="HuBiT v4.0 - Plataforma integral para gestión de fincas y servicios" />
        <meta name="keywords" content="fincas, gestión, servicios, administración, comunidades" />
        <meta name="author" content="HuBiT" />
        
        {/* Open Graph para redes sociales */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="HuBiT v4.0" />
        <meta property="og:description" content="Plataforma integral para gestión de fincas y servicios" />
        <meta property="og:site_name" content="HuBiT" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="HuBiT v4.0" />
        <meta name="twitter:description" content="Plataforma integral para gestión de fincas y servicios" />
        
        {/* Preconnect para optimización */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Manifest para PWA */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Favicons para diferentes dispositivos */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        
        {/* Softgen AI monitoring script */}
        <script 
          src="https://cdn.softgen.ai/script.js" 
          async 
          data-softgen-monitoring="true"
        />
        
        {/* Script para detectar iOS y DuckDuckGo */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Detectar iOS
              window.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
              
              // Detectar DuckDuckGo
              window.isDuckDuckGo = /DuckDuckGo/.test(navigator.userAgent);
              
              // Configurar zoom para iOS
              if (window.isIOS) {
                document.addEventListener('gesturestart', function (e) {
                  e.preventDefault();
                });
                document.addEventListener('gesturechange', function (e) {
                  e.preventDefault();
                });
                document.addEventListener('gestureend', function (e) {
                  e.preventDefault();
                });
              }
            `
          }}
        />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}