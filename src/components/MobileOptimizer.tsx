import { useEffect, useState, useCallback } from "react";

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

  const handleGestureStart = useCallback((e: Event) => {
    if (!enablePinchZoom) {
      e.preventDefault();
    }
  }, [enablePinchZoom]);

  const handleGestureChange = useCallback((e: Event) => {
    if (!enablePinchZoom) {
      e.preventDefault();
    }
  }, [enablePinchZoom]);

  const handleGestureEnd = useCallback((e: Event) => {
    if (!enablePinchZoom) {
      e.preventDefault();
    }
  }, [enablePinchZoom]);

  useEffect(() => {
    // Detectar iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);

    // Detectar DuckDuckGo
    const duckDuckGo = /DuckDuckGo/.test(navigator.userAgent);
    setIsDuckDuckGo(duckDuckGo);

    // Configurar viewport para iOS
    if (iOS) {
      const viewport = document.querySelector('meta[name=viewport]');
      if (viewport) {
        viewport.setAttribute('content', 
          'width=device-width, initial-scale=1.0, maximum-scale=5.0, minimum-scale=0.5, user-scalable=yes, viewport-fit=cover'
        );
      }
    }

    // Prevenir zoom accidental en iOS
    if (iOS) {
      document.addEventListener('gesturestart', handleGestureStart, { passive: false });
      document.addEventListener('gesturechange', handleGestureChange, { passive: false });
      document.addEventListener('gestureend', handleGestureEnd, { passive: false });
    }

    return () => {
      if (iOS) {
        document.removeEventListener('gesturestart', handleGestureStart);
        document.removeEventListener('gesturechange', handleGestureChange);
        document.removeEventListener('gestureend', handleGestureEnd);
      }
    };
  }, [iOS, handleGestureStart, handleGestureChange, handleGestureEnd]);

  const getTouchDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return 0;
    
    const touch1 = touches[0];
    const touch2 = touches[1];
    
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) + 
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!enablePinchZoom || e.touches.length !== 2) return;
    
    const distance = getTouchDistance(e.touches);
    setLastTouchDistance(distance);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!enablePinchZoom || e.touches.length !== 2) return;
    
    e.preventDefault();
    
    const distance = getTouchDistance(e.touches);
    if (lastTouchDistance > 0) {
      const scaleChange = distance / lastTouchDistance;
      const newScale = Math.min(Math.max(scale * scaleChange, 0.5), 5);
      setScale(newScale);
    }
    setLastTouchDistance(distance);
  };

  const handleTouchEnd = () => {
    setLastTouchDistance(0);
  };

  const handleDoubleClick = () => {
    if (enablePinchZoom) {
      setScale(scale === 1 ? 2 : 1);
    }
  };

  const containerClasses = [
    className,
    enablePinchZoom ? "pinch-zoom" : "touch-manipulation",
    isIOS ? "ios-scroll" : "",
    "transition-transform duration-200 ease-out"
  ].filter(Boolean).join(" ");

  return (
    <div
      className={containerClasses}
      style={{
        transform: enablePinchZoom ? `scale(${scale})` : undefined,
        transformOrigin: "center center"
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onDoubleClick={handleDoubleClick}
    >
      {children}
      
      {/* Indicador de compatibilidad (solo en desarrollo) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black/80 text-white text-xs p-2 rounded z-50">
          <div>iOS: {isIOS ? '✓' : '✗'}</div>
          <div>DuckDuckGo: {isDuckDuckGo ? '✓' : '✗'}</div>
          <div>Zoom: {scale.toFixed(1)}x</div>
        </div>
      )}
    </div>
  );
}
