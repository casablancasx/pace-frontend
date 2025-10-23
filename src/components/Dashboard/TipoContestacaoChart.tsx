import React, { useState, useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../contexts/ThemeContext';
import './TipoContestacaoChart.css';

interface TipoData {
  tipo: number | null;
  quantidade: number;
}

interface ApiResponse {
  data: TipoData[];
  total: number;
}

const TipoContestacaoChart: React.FC = () => {
  const { theme } = useTheme();
  const [chartData, setChartData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8006/ws/tipo_contestacao');
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket conectado');
      setConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const response: ApiResponse = JSON.parse(event.data);
        const formatted = response.data.map(item => ({
          tipo: item.tipo === null ? 'Sem Tipo' : `Tipo ${item.tipo}`,
          quantidade: item.quantidade
        }));
        setChartData(formatted);
        setTotal(response.total);
      } catch (error) {
        console.error('Erro ao processar dados:', error);
      }
    };

    ws.onerror = () => setConnected(false);
    ws.onclose = () => setConnected(false);

    return () => ws.close();
  }, []);

  const colors = {
    bar: '#3b82f6',
    grid: theme === 'dark' ? '#374151' : '#e5e7eb',
    text: theme === 'dark' ? '#d1d5db' : '#6b7280'
  };

  return (
    <div className="tipo-contestacao-chart">
      <div className="chart-header">
        <div>
          <h3>Tipos de Contestação</h3>
          {total > 0 && <span className="total-badge">Total: {total}</span>}
        </div>
        <span className={`status-badge ${connected ? 'connected' : 'disconnected'}`}>
          {connected ? '● Conectado' : '○ Desconectado'}
        </span>
      </div>
      
      <div className="chart-container">
        {chartData.length === 0 ? (
          <div className="empty-state">Aguardando dados...</div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
              <XAxis dataKey="tipo" stroke={colors.text} />
              <YAxis stroke={colors.text} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: theme === 'dark' ? '#1f2937' : '#fff',
                  border: `1px solid ${colors.grid}`
                }}
              />
              <Bar dataKey="quantidade" fill={colors.bar} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default TipoContestacaoChart;
