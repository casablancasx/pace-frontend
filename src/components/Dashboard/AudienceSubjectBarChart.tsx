import React, { useMemo } from 'react';
import './AudienceSubjectBarChart.css';

export interface AudienceSubjectMetric {
  assunto: string;
  audiencias: number;
}

interface AudienceSubjectBarChartProps {
  data: AudienceSubjectMetric[];
  limit?: number;
}

const AudienceSubjectBarChart: React.FC<AudienceSubjectBarChartProps> = ({ data, limit = 12 }) => {
  const processedData = useMemo(() => {
    const cleaned = data
      .filter((item) => item.assunto && item.assunto.trim() && item.audiencias > 0)
      .sort((a, b) => b.audiencias - a.audiencias);

    if (!limit || limit >= cleaned.length) {
      return cleaned;
    }

    return cleaned.slice(0, limit);
  }, [data, limit]);

  const maxValue = processedData[0]?.audiencias ?? 0;

  return (
    <div className="audience-chart">
      <div className="audience-chart__header">
        <h2 className="audience-chart__title">Incidência de assuntos por audiência</h2>
        <span className="audience-chart__subtitle">Top {processedData.length} assuntos</span>
      </div>

      <div className="audience-chart__body">
        {processedData.map((item) => {
          const width = maxValue === 0 ? 0 : Math.max((item.audiencias / maxValue) * 100, 4);
          return (
            <div className="audience-chart__row" key={item.assunto}>
              <span className="audience-chart__label" title={item.assunto}>{item.assunto}</span>
              <div className="audience-chart__bar-wrapper">
                <div
                  className="audience-chart__bar"
                  style={{ width: `${width}%` }}
                />
              </div>
              <span className="audience-chart__value">{item.audiencias.toLocaleString('pt-BR')}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AudienceSubjectBarChart;
