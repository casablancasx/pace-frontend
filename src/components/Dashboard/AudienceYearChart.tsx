import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { useTheme } from '../../contexts/ThemeContext';
import './AudienceYearChart.css';

export interface AudienceYearMetric {
  ano: number;
  audiencias: number;
}

interface AudienceYearChartProps {
  data: AudienceYearMetric[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="audience-year-chart__tooltip">
        <p className="audience-year-chart__tooltip-label">{`Ano: ${label}`}</p>
        <p className="audience-year-chart__tooltip-value">
          {`Audiências: ${payload[0].value.toLocaleString()}`}
        </p>
      </div>
    );
  }
  return null;
};

const AudienceYearChart: React.FC<AudienceYearChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Colors based on theme
  const colors = {
    grid: isDark ? '#2F2F32' : '#e5e7eb',
    axis: isDark ? '#d1d5db' : '#6b7280',
    activeDot: isDark ? '#232326' : '#ffffff'
  };

  return (
    <div className="audience-year-chart">
      <div className="audience-year-chart__header">
        <h3 className="audience-year-chart__title">Audiências por Ano</h3>
      </div>
      
      <div className="audience-year-chart__content">
        <div className="audience-year-chart__chart-container">
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 20,
              }}
            >
              <defs>
                <linearGradient id="colorAudiencias" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
              <XAxis 
                dataKey="ano" 
                stroke={colors.axis}
                fontSize={12}
                fontWeight={500}
              />
              <YAxis 
                stroke={colors.axis}
                fontSize={12}
                fontWeight={500}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="audiencias"
                stroke="#3b82f6"
                strokeWidth={3}
                fill="url(#colorAudiencias)"
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: '#3b82f6', strokeWidth: 2, fill: colors.activeDot }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AudienceYearChart;