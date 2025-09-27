import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, Clock, RefreshCw, X } from 'lucide-react';
import './AudienciasPendentes.css';

export interface AudienciaPendente {
  id: number;
  numeroProcesso: string;
  destinatario: string;
  motivoErro: string;
  lida: boolean;
}

interface AudienciasPendentesProps {
  className?: string;
}

const AudienciasPendentes: React.FC<AudienciasPendentesProps> = ({ className }) => {
  const [audiencias, setAudiencias] = useState<AudienciaPendente[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const websocketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);

  // Mock data para desenvolvimento
  const mockAudiencias: AudienciaPendente[] = [
    {
      id: 1,
      numeroProcesso: '1234567-89.2024.8.26.0001',
      destinatario: 'João Silva Santos',
      motivoErro: 'Timeout na conexão com Sapiens',
      lida: false
    },
    {
      id: 2,
      numeroProcesso: '9876543-21.2024.8.26.0002',
      destinatario: 'Pedro Almeida Silva',
      motivoErro: 'Erro de autenticação no Sapiens',
      lida: false
    },
    {
      id: 3,
      numeroProcesso: '5555444-33.2024.8.26.0003',
      destinatario: 'Ana Carolina Ferreira',
      motivoErro: 'Sistema Sapiens indisponível',
      lida: true
    },
    {
      id: 4,
      numeroProcesso: '7777888-99.2024.8.26.0004',
      destinatario: 'Roberto Santos Lima',
      motivoErro: 'Falha na comunicação com API',
      lida: false
    }
  ];

  const connectWebSocket = () => {
    try {
      // Em produção, usar a URL real do WebSocket
      // websocketRef.current = new WebSocket('ws://localhost:8080/audiencias-pendentes');
      
      // Para desenvolvimento, simular conexão WebSocket
      setIsLoading(true);
      setTimeout(() => {
        setAudiencias(mockAudiencias);
        setIsConnected(true);
        setIsLoading(false);
        setError(null);
      }, 1000);

      /* Código real do WebSocket quando integrar:
      websocketRef.current = new WebSocket('ws://localhost:8080/audiencias-pendentes');
      
      websocketRef.current.onopen = () => {
        setIsConnected(true);
        setIsLoading(false);
        setError(null);
        console.log('WebSocket conectado');
      };

      websocketRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'AUDIENCIA_ADDED') {
            setAudiencias(prev => [...prev, data.audiencia]);
          } else if (data.type === 'AUDIENCIA_UPDATED') {
            setAudiencias(prev => 
              prev.map(aud => aud.id === data.audiencia.id ? data.audiencia : aud)
            );
          } else if (data.type === 'AUDIENCIA_REMOVED') {
            setAudiencias(prev => prev.filter(aud => aud.id !== data.audienciaId));
          } else if (data.type === 'AUDIENCIAS_LIST') {
            setAudiencias(data.audiencias);
          }
        } catch (error) {
          console.error('Erro ao processar mensagem WebSocket:', error);
        }
      };

      websocketRef.current.onerror = (error) => {
        console.error('Erro no WebSocket:', error);
        setError('Erro na conexão com o servidor');
      };

      websocketRef.current.onclose = () => {
        setIsConnected(false);
        console.log('WebSocket desconectado');
        
        // Tentar reconectar após 5 segundos
        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket();
        }, 5000);
      };
      */
    } catch (error) {
      console.error('Erro ao conectar WebSocket:', error);
      setError('Erro ao conectar com o servidor');
      setIsLoading(false);
    }
  };

  const disconnectWebSocket = () => {
    if (websocketRef.current) {
      websocketRef.current.close();
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
  };

  const handleMarcarComoLida = (audienciaId: number) => {
    setAudiencias(prev => 
      prev.map(aud => 
        aud.id === audienciaId 
          ? { ...aud, lida: !aud.lida }
          : aud
      )
    );
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      disconnectWebSocket();
    };
  }, []);

  if (isLoading) {
    return (
      <div className={`audiencias-pendentes ${className || ''}`}>
        <div className="audiencias-header">
          <h3 className="audiencias-title">
            <Clock size={20} />
            Audiências Pendentes no Sapiens
          </h3>
          <div className="connection-status loading">
            <RefreshCw size={16} className="spinning" />
            Carregando...
          </div>
        </div>
        <div className="loading-container">
          <RefreshCw size={24} className="spinning" />
          <p>Carregando audiências pendentes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`audiencias-pendentes ${className || ''}`}>
        <div className="audiencias-header">
          <h3 className="audiencias-title">
            <Clock size={20} />
            Audiências Pendentes no Sapiens
          </h3>
          <div className="connection-status error">
            <X size={16} />
            Erro na conexão
          </div>
        </div>
        <div className="error-container">
          <AlertTriangle size={24} />
          <p>{error}</p>
          <button onClick={connectWebSocket} className="retry-button">
            <RefreshCw size={16} />
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`audiencias-pendentes ${className || ''}`}>
      <div className="audiencias-header">
        <h3 className="audiencias-title">
          <Clock size={20} />
          Audiências Pendentes no Sapiens
          {audiencias.length > 0 && (
            <span className="audiencias-count">{audiencias.length}</span>
          )}
        </h3>
        <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
          <div className="status-dot"></div>
          {isConnected ? 'Conectado' : 'Desconectado'}
        </div>
      </div>

      {audiencias.length === 0 ? (
        <div className="empty-state">
          <Clock size={48} />
          <h4>Nenhuma audiência pendente</h4>
          <p>Todas as audiências foram processadas com sucesso no Sapiens.</p>
        </div>
      ) : (
        <div className="audiencias-list">
          {audiencias.map((audiencia) => (
            <div key={audiencia.id} className={`audiencia-item ${audiencia.lida ? 'lida' : 'nao-lida'}`}>
              <div className="audiencia-content">
                <div className="audiencia-processo">
                  <strong>Processo:</strong> {audiencia.numeroProcesso}
                </div>
                <div className="audiencia-destinatario">
                  <strong>Destinatário:</strong> {audiencia.destinatario}
                </div>
                <div className="audiencia-erro">
                  <strong>Erro:</strong> <span className="erro-text">{audiencia.motivoErro}</span>
                </div>
              </div>
              <div className="audiencia-actions">
                <button
                  onClick={() => handleMarcarComoLida(audiencia.id)}
                  className={`marcar-lida-button ${audiencia.lida ? 'lida' : 'nao-lida'}`}
                  title={audiencia.lida ? 'Marcar como não lida' : 'Marcar como lida'}
                >
                  {audiencia.lida ? 'Lida' : 'Não lida'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AudienciasPendentes;