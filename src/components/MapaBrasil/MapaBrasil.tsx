import { useEffect, useMemo, useRef, useState } from 'react';
import brazilSvg from '../../assets/brazil.svg?raw';
import './MapaBrasil.css';

export interface BrazilStateDatum {
  UF: string;
  pautas: number;
  audiencias: number;
}

interface TooltipState {
  visible: boolean;
  uf: string | null;
  pautas: number;
  audiencias: number;
  position: {
    x: number;
    y: number;
  };
}

interface MapaBrasilProps {
  data: BrazilStateDatum[];
}

const MIN_COLOR = [197, 221, 255];
const MAX_COLOR = [13, 71, 161];
const FALLBACK_COLOR = '#E5E7EB';

const getStateCode = (pathId: string): string => pathId.replace('BR-', '');

const interpolateColor = (ratio: number): string => {
  const clamp = Math.min(1, Math.max(0, ratio));

  const [rMin, gMin, bMin] = MIN_COLOR;
  const [rMax, gMax, bMax] = MAX_COLOR;

  const r = Math.round(rMin + (rMax - rMin) * clamp);
  const g = Math.round(gMin + (gMax - gMin) * clamp);
  const b = Math.round(bMin + (bMax - bMin) * clamp);

  return `rgb(${r}, ${g}, ${b})`;
};

const MapaBrasil: React.FC<MapaBrasilProps> = ({ data }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    uf: null,
    pautas: 0,
    audiencias: 0,
    position: { x: 0, y: 0 }
  });

  const stateDataMap = useMemo(() => {
    const map = new Map<string, BrazilStateDatum>();

    data.forEach((item) => {
      map.set(item.UF.toUpperCase(), item);
    });

    return map;
  }, [data]);

  const { minAudiencias, maxAudiencias } = useMemo(() => {
    if (!data.length) {
      return { minAudiencias: 0, maxAudiencias: 0 };
    }

    const values = data.map((item) => item.audiencias);
    return {
      minAudiencias: Math.min(...values),
      maxAudiencias: Math.max(...values)
    };
  }, [data]);

  useEffect(() => {
    const container = mapRef.current;

    if (!container) {
      return;
    }

    container.innerHTML = brazilSvg;

    const svgElement = container.querySelector('svg');
    if (svgElement) {
      const widthAttr = svgElement.getAttribute('width');
      const heightAttr = svgElement.getAttribute('height');

      if (widthAttr && heightAttr) {
        svgElement.setAttribute('viewBox', `0 0 ${widthAttr} ${heightAttr}`);
      }

      svgElement.removeAttribute('width');
      svgElement.removeAttribute('height');
      svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    }

    const paths = Array.from(container.querySelectorAll<SVGPathElement>('path'));

    const getBaseColor = (uf: string): string => {
      const stateData = stateDataMap.get(uf);

      if (!stateData || maxAudiencias === minAudiencias) {
        if (stateData && maxAudiencias === minAudiencias) {
          return interpolateColor(1);
        }

        return FALLBACK_COLOR;
      }

      const ratio = (stateData.audiencias - minAudiencias) / (maxAudiencias - minAudiencias);
      return interpolateColor(ratio);
    };

    const handleMouseEnter = (event: MouseEvent) => {
      const target = event.currentTarget as SVGPathElement | null;
      if (!target) {
        return;
      }

      const uf = getStateCode(target.id);
      const stateData = stateDataMap.get(uf);

      if (!stateData) {
        return;
      }

      target.style.filter = 'brightness(0.85)';

      const rect = container.getBoundingClientRect();

      setTooltip({
        visible: true,
        uf,
        pautas: stateData.pautas,
        audiencias: stateData.audiencias,
        position: {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top
        }
      });
    };

    const handleMouseMove = (event: MouseEvent) => {
      const target = event.currentTarget as SVGPathElement | null;
      if (!target) {
        return;
      }

      const uf = getStateCode(target.id);
      const stateData = stateDataMap.get(uf);

      if (!stateData) {
        return;
      }

      const rect = container.getBoundingClientRect();
      setTooltip((prev) => ({
        ...prev,
        position: {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top
        }
      }));
    };

    const handleMouseLeave = (event: MouseEvent) => {
      const target = event.currentTarget as SVGPathElement | null;
      if (!target) {
        return;
      }

      target.style.filter = 'none';

      setTooltip((prev) => ({
        ...prev,
        visible: false
      }));
    };

    paths.forEach((path) => {
      const uf = getStateCode(path.id);
      const fillColor = getBaseColor(uf);

      path.setAttribute('fill', fillColor);
      path.setAttribute('stroke', '#111827');
      path.setAttribute('stroke-width', '0.5');
      path.style.cursor = stateDataMap.has(uf) ? 'pointer' : 'default';

      path.removeEventListener('mouseenter', handleMouseEnter as EventListener);
      path.removeEventListener('mousemove', handleMouseMove as EventListener);
      path.removeEventListener('mouseleave', handleMouseLeave as EventListener);

      path.addEventListener('mouseenter', handleMouseEnter as EventListener);
      path.addEventListener('mousemove', handleMouseMove as EventListener);
      path.addEventListener('mouseleave', handleMouseLeave as EventListener);
    });

    return () => {
      paths.forEach((path) => {
        path.removeEventListener('mouseenter', handleMouseEnter as EventListener);
        path.removeEventListener('mousemove', handleMouseMove as EventListener);
        path.removeEventListener('mouseleave', handleMouseLeave as EventListener);
      });

      container.innerHTML = '';
    };
  }, [maxAudiencias, minAudiencias, stateDataMap]);

  return (
    <div className="brazil-map">
      <div className="brazil-map__svg" ref={mapRef} />

      {tooltip.visible && tooltip.uf && (
        <div
          className="brazil-map__tooltip"
          style={{
            top: tooltip.position.y,
            left: tooltip.position.x
          }}
        >
          <strong>{tooltip.uf}</strong>
          <span>{tooltip.audiencias.toLocaleString('pt-BR')} audiências</span>
          <span>{tooltip.pautas.toLocaleString('pt-BR')} pautas</span>
        </div>
      )}

      <div className="brazil-map__legend">
        <span>Menos audiências</span>
        <div className="brazil-map__legend-gradient" aria-hidden="true" />
        <span>Mais audiências</span>
      </div>
    </div>
  );
};

export default MapaBrasil;
