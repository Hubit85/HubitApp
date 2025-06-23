
import { useEffect, useState, useCallback, useRef } from "react";

interface MobileOptimizerProps {
  children: React.ReactNode;
  enablePinchZoom?: boolean;
  className?: string;
}

export default function MobileOptimizer({ 
  children, 
  enablePinchZoom = true, 
  className = "" 
}: MobileOptimizerProps) {
  const [isIOS, setIsIOS] = useState(false);
  const [isDuckDuckGo, setIsDuckDuckGo] = useState(false);
  const [scale, setScale] = useState(1);
  const [lastTouchDistance, setLastTouchDistance] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detectar dispositivos y navegadores
  useEffect(() => {
    const userAgent = navigator.userAgent;
    const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
    const isDuckDuckGoBrowser = /DuckDuckGo/.test(userAgent);
    
    setIsIOS(isIOSDevice);
    setIsDuckDuckGo(isDuckDuckGoBrowser);

    // Configurar viewport para dispositivos móviles
    const viewport = document.querySelector('meta[name=viewport]');
    if (viewport && enablePinchZoom) {
      if (isIOSDevice) {
        viewport.setAttribute('content', 
          'width=device-width, initial-scale=1.0, maximum-scale=5.0, minimum-scale=0.5, user-scalable=yes, viewport-fit=cover'
        );
      } else {
        viewport.setAttribute('content', 
          'width=device-width, initial-scale=1.0, maximum-scale=5.0, minimum-scale=0.5, user-scalable=yes'
        );
      }
    }
  }, [enablePinchZoom]);

  // Calcular distancia entre dos puntos táctiles
  const getTouchDistance = useCallback((touches: TouchList) => {
    if (touches.length < 2) return 0;
    
    const touch1 = touches[0];
    const touch2 = touches[1];
    
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) + 
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  }, []);

  // Manejar inicio del gesto táctil
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!enablePinchZoom) return;
    
    if (e.touches.length === 2) {
      e.preventDefault();
      const distance = getTouchDistance(e.touches);
      setLastTouchDistance(distance);
      setIsZooming(true);
    }
  }, [enablePinchZoom, getTouchDistance]);

  // Manejar movimiento del gesto táctil
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!enablePinchZoom || !isZooming || e.touches.length !== 2) return;
    
    e.preventDefault();
    
    const distance = getTouchDistance(e.touches);
    if (lastTouchDistance > 0) {
      const scaleChange = distance / lastTouchDistance;
      const newScale = Math.min(Math.max(scale * scaleChange, 0.5), 5);
      setScale(newScale);
    }
    setLastTouchDistance(distance);
  }, [enablePinchZoom, isZooming, lastTouchDistance, scale, getTouchDistance]);

  // Manejar fin del gesto táctil
  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!enablePinchZoom) return;
    
    if (e.touches.length < 2) {
      setLastTouchDistance(0);
      setIsZooming(false);
    }
  }, [enablePinchZoom]);

  // Manejar doble toque para zoom
  const handleDoubleClick = useCallback(() => {
    if (enablePinchZoom) {
      setScale(prevScale => prevScale === 1 ? 2 : 1);
    }
  }, [enablePinchZoom]);

  // Configurar event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enablePinchZoom) return;

    // Agregar event listeners con opciones específicas
    const options = { passive: false };
    
    container.addEventListener('touchstart', handleTouchStart, options);
    container.addEventListener('touchmove', handleTouchMove, options);
    container.addEventListener('touchend', handleTouchEnd, options);
    container.addEventListener('dblclick', handleDoubleClick);

    // Prevenir gestos por defecto en iOS
    if (isIOS) {
      const preventGesture = (e: Event) => {
        if (!enablePinchZoom) {
          e.preventDefault();
        }
      };

      document.addEventListener('gesturestart', preventGesture, options);
      document.addEventListener('gesturechange', preventGesture, options);
      document.addEventListener('gestureend', preventGesture, options);

      return () => {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('touchend', handleTouchEnd);
        container.removeEventListener('dblclick', handleDoubleClick);
        document.removeEventListener('gesturestart', preventGesture);
        document.removeEventListener('gesturechange', preventGesture);
        document.removeEventListener('gestureend', preventGesture);
      };
    }

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('dblclick', handleDoubleClick);
    };
  }, [enablePinchZoom, isIOS, handleTouchStart, handleTouchMove, handleTouchEnd, handleDoubleClick]);

  // Resetear zoom con botón
  const resetZoom = useCallback(() => {
    setScale(1);
  }, []);

  const containerClasses = [
    className,
    enablePinchZoom ? "pinch-zoom" : "touch-manipulation",
    isIOS ? "ios-scroll" : "",
    "transition-transform duration-200 ease-out",
    "overflow-hidden"
  ].filter(Boolean).join(" ");

  return (
    <div
      ref={containerRef}
      className={containerClasses}
      style={{
        transform: enablePinchZoom ? `scale(${scale})` : undefined,
        transformOrigin: "center center",
        touchAction: enablePinchZoom ? "none" : "manipulation"
      }}
    >
      {children}
      
      {/* Controles de zoom (solo en desarrollo) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black/90 text-white text-xs p-3 rounded-lg z-50 space-y-1">
          <div>iOS: {isIOS ? '✓' : '✗'}</div>
          <div>DuckDuckGo: {isDuckDuckGo ? '✓' : '✗'}</div>
          <div>Zoom: {scale.toFixed(1)}x</div>
          <div>Zooming: {isZooming ? '✓' : '✗'}</div>
          {enablePinchZoom && scale !== 1 && (
            <button 
              onClick={resetZoom}
              className="bg-white text-black px-2 py-1 rounded text-xs mt-1 w-full"
            >
              Reset Zoom
            </button>
          )}
        </div>
      )}
    </div>
  );
}
