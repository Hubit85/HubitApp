import { useEffect, useState, useCallback, useRef } from "react";

interface ZoomableSectionProps {
  children: React.ReactNode;
  className?: string;
  enableZoom?: boolean;
  maxScale?: number;
  minScale?: number;
}

export default function ZoomableSection({ 
  children, 
  className = "",
  enableZoom = true,
  maxScale = 3,
  minScale = 0.5
}: ZoomableSectionProps) {
  const [scale, setScale] = useState(1);
  const [lastTouchDistance, setLastTouchDistance] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [lastTouchCenter, setLastTouchCenter] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPosition, setLastPanPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

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

  // Calcular centro entre dos puntos táctiles
  const getTouchCenter = useCallback((touches: TouchList) => {
    if (touches.length < 2) return { x: 0, y: 0 };
    
    const touch1 = touches[0];
    const touch2 = touches[1];
    
    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2
    };
  }, []);

  // Manejar inicio del gesto táctil
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!enableZoom) return;
    
    if (e.touches.length === 2) {
      // Gesto de pellizco para zoom
      e.preventDefault();
      const distance = getTouchDistance(e.touches);
      const center = getTouchCenter(e.touches);
      setLastTouchDistance(distance);
      setLastTouchCenter(center);
      setIsZooming(true);
      setIsPanning(false);
    } else if (e.touches.length === 1 && scale > 1) {
      // Gesto de arrastre para pan cuando hay zoom
      const touch = e.touches[0];
      setLastPanPosition({ x: touch.clientX, y: touch.clientY });
      setIsPanning(true);
      setIsZooming(false);
    }
  }, [enableZoom, getTouchDistance, getTouchCenter, scale]);

  // Manejar movimiento del gesto táctil
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!enableZoom) return;
    
    if (isZooming && e.touches.length === 2) {
      // Zoom con pellizco
      e.preventDefault();
      
      const distance = getTouchDistance(e.touches);
      const center = getTouchCenter(e.touches);
      
      if (lastTouchDistance > 0) {
        const scaleChange = distance / lastTouchDistance;
        const newScale = Math.min(Math.max(scale * scaleChange, minScale), maxScale);
        
        // Calcular nueva posición basada en el centro del gesto
        const deltaX = center.x - lastTouchCenter.x;
        const deltaY = center.y - lastTouchCenter.y;
        
        setScale(newScale);
        setTranslateX(prev => prev + deltaX * 0.5);
        setTranslateY(prev => prev + deltaY * 0.5);
        setLastTouchCenter(center);
      }
      setLastTouchDistance(distance);
    } else if (isPanning && e.touches.length === 1 && scale > 1) {
      // Pan cuando hay zoom
      e.preventDefault();
      
      const touch = e.touches[0];
      const deltaX = touch.clientX - lastPanPosition.x;
      const deltaY = touch.clientY - lastPanPosition.y;
      
      setTranslateX(prev => prev + deltaX);
      setTranslateY(prev => prev + deltaY);
      setLastPanPosition({ x: touch.clientX, y: touch.clientY });
    }
  }, [enableZoom, isZooming, isPanning, lastTouchDistance, scale, getTouchDistance, getTouchCenter, lastTouchCenter, maxScale, minScale, lastPanPosition]);

  // Manejar fin del gesto táctil
  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!enableZoom) return;
    
    if (e.touches.length < 2) {
      setLastTouchDistance(0);
      setIsZooming(false);
    }
    
    if (e.touches.length === 0) {
      setIsPanning(false);
    }
  }, [enableZoom]);

  // Manejar doble toque para zoom
  const handleDoubleClick = useCallback((e: MouseEvent) => {
    if (!enableZoom) return;
    
    e.preventDefault();
    
    if (scale === 1) {
      setScale(2);
      // Centrar en el punto donde se hizo doble click
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const centerX = e.clientX - rect.left - rect.width / 2;
        const centerY = e.clientY - rect.top - rect.height / 2;
        setTranslateX(-centerX * 0.5);
        setTranslateY(-centerY * 0.5);
      }
    } else {
      setScale(1);
      setTranslateX(0);
      setTranslateY(0);
    }
  }, [enableZoom, scale]);

  // Manejar scroll con rueda del ratón para zoom
  const handleWheel = useCallback((e: WheelEvent) => {
    if (!enableZoom || !e.ctrlKey) return;
    
    e.preventDefault();
    
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.min(Math.max(scale * delta, minScale), maxScale);
    
    if (newScale !== scale) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const centerX = e.clientX - rect.left - rect.width / 2;
        const centerY = e.clientY - rect.top - rect.height / 2;
        
        const scaleChange = newScale / scale;
        setTranslateX(prev => prev + centerX * (1 - scaleChange));
        setTranslateY(prev => prev + centerY * (1 - scaleChange));
      }
      setScale(newScale);
    }
  }, [enableZoom, scale, minScale, maxScale]);

  // Configurar event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enableZoom) return;

    const options = { passive: false };
    
    container.addEventListener('touchstart', handleTouchStart, options);
    container.addEventListener('touchmove', handleTouchMove, options);
    container.addEventListener('touchend', handleTouchEnd, options);
    container.addEventListener('dblclick', handleDoubleClick);
    container.addEventListener('wheel', handleWheel, options);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('dblclick', handleDoubleClick);
      container.removeEventListener('wheel', handleWheel);
    };
  }, [enableZoom, handleTouchStart, handleTouchMove, handleTouchEnd, handleDoubleClick, handleWheel]);

  // Resetear zoom
  const resetZoom = useCallback(() => {
    setScale(1);
    setTranslateX(0);
    setTranslateY(0);
  }, []);

  const containerClasses = [
    className,
    "relative",
    enableZoom ? "cursor-grab" : "",
    isZooming || isPanning ? "cursor-grabbing" : "",
    "overflow-auto"
  ].filter(Boolean).join(" ");

  return (
    <div
      ref={containerRef}
      className={containerClasses}
      style={{
        touchAction: enableZoom ? (scale > 1 ? "none" : "pan-y pinch-zoom") : "auto",
        height: "100%"
      }}
    >
      <div
        className="transition-transform duration-200 ease-out origin-center min-h-full"
        style={{
          transform: enableZoom 
            ? `scale(${scale}) translate(${translateX}px, ${translateY}px)` 
            : undefined,
          transformOrigin: "center top"
        }}
      >
        {children}
      </div>
      
      {/* Controles de zoom (solo cuando hay zoom activo) */}
      {enableZoom && scale !== 1 && (
        <button 
          onClick={resetZoom}
          className="fixed top-20 right-4 bg-black/80 text-white px-3 py-2 rounded-lg text-sm z-50 hover:bg-black/90 transition-colors"
        >
          Reset Zoom
        </button>
      )}
      
      {/* Indicador de zoom en desarrollo */}
      {process.env.NODE_ENV === 'development' && enableZoom && (
        <div className="fixed bottom-4 left-4 bg-black/80 text-white text-xs p-2 rounded-lg z-50">
          Zoom: {scale.toFixed(1)}x
          {scale > 1 && <div>Pan: {translateX.toFixed(0)}, {translateY.toFixed(0)}</div>}
        </div>
      )}
    </div>
  );
}
