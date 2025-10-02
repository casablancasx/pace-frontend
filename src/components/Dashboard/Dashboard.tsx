import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import Layout from '../Layout';
import MapaBrasil from '../MapaBrasil';
import AudienceSubjectBarChart from './AudienceSubjectBarChart';
import AudienceYearChart from './AudienceYearChart';
import type { AudienceSubjectMetric } from './AudienceSubjectBarChart';
import type { AudienceYearMetric } from './AudienceYearChart';
import type { DashboardData, DashboardStateMetric, MetricCard } from '../../types';
import { useAuthorization } from '../../contexts/AuthorizationContext';
import './Dashboard.css';

interface DashboardProps {
  data?: DashboardData;
}

const brazilMockStates: DashboardStateMetric[] = [
  { UF: 'AC', pautas: 43, audiencias: 231 },
  { UF: 'AM', pautas: 8, audiencias: 25 },
  { UF: 'AP', pautas: 17, audiencias: 103 },
  { UF: 'BA', pautas: 421, audiencias: 3640 },
  { UF: 'DF', pautas: 44, audiencias: 146 },
  { UF: 'GO', pautas: 149, audiencias: 842 },
  { UF: 'MA', pautas: 210, audiencias: 1856 },
  { UF: 'MT', pautas: 51, audiencias: 216 },
  { UF: 'PA', pautas: 116, audiencias: 922 },
  { UF: 'PI', pautas: 114, audiencias: 1335 },
  { UF: 'RO', pautas: 1, audiencias: 2 },
  { UF: 'RR', pautas: 7, audiencias: 38 },
  { UF: 'TO', pautas: 55, audiencias: 423 }
];

const audienceSubjectData: AudienceSubjectMetric[] = [
  { assunto: '', audiencias: 2 },
  { assunto: 'Abono da Lei 8.178/91', audiencias: 6 },
  { assunto: 'Abono de Permanência em Serviço (Art. 87)', audiencias: 1 },
  { assunto: 'Ação Regressiva', audiencias: 1 },
  { assunto: 'Acidente de Trabalho', audiencias: 18 },
  { assunto: 'Acidente em Serviço', audiencias: 1 },
  { assunto: 'Adicional de 25%', audiencias: 25 },
  { assunto: 'Agente Agressivo - Ruído', audiencias: 1 },
  { assunto: 'Alteração do coeficiente de cálculo de pensão', audiencias: 1 },
  { assunto: 'Aposentadoria Especial (Art. 57/8)', audiencias: 12 },
  { assunto: 'Aposentadoria Híbrida (Art. 48/106)', audiencias: 299 },
  { assunto: 'Aposentadoria por Idade (Art. 48/51)', audiencias: 2 },
  { assunto: 'Aposentadoria por Invalidez', audiencias: 120 },
  { assunto: 'Aposentadoria por Tempo de Contribuição (Art. 55/6)', audiencias: 86 },
  { assunto: 'Aposentadoria por Tempo de Serviço (Art. 52/4)', audiencias: 1 },
  { assunto: 'Aposentadoria Rural (Art. 48/51)', audiencias: 3107 },
  { assunto: 'Aposentadoria Urbana (Art. 48/51)', audiencias: 10 },
  { assunto: 'Atendimento Bancário', audiencias: 1 },
  { assunto: 'Auxílio-Acidente (Art. 86)', audiencias: 1 },
  { assunto: 'Auxílio-Doença Acidentário', audiencias: 4 },
  { assunto: 'Auxílio-Doença Previdenciário', audiencias: 809 },
  { assunto: 'Auxílio-Reclusão (Art. 80)', audiencias: 12 },
  { assunto: 'Averbação/Cômputo de Auxílio Doença Não Acidentário como Tempo de Serviço', audiencias: 2 },
  { assunto: 'Averbação/Cômputo de tempo de serviço de empregado doméstico', audiencias: 1 },
  { assunto: 'Averbação/Cômputo de tempo de serviço de segurado especial (regime de economia familiar)', audiencias: 7 },
  { assunto: 'Averbação/Cômputo de tempo de serviço  rural (empregado/empregador)', audiencias: 1 },
  { assunto: 'Averbação/Cômputo de tempo de serviço urbano', audiencias: 1 },
  { assunto: 'Cartão de Crédito', audiencias: 2 },
  { assunto: 'Certidão de Tempo de Serviço', audiencias: 4 },
  { assunto: 'Cômputo de Período Rural Remoto', audiencias: 36 },
  { assunto: 'Concessão', audiencias: 18 },
  { assunto: 'Contratos Bancários', audiencias: 1 },
  { assunto: 'Contribuinte Individual ou Segurada Desempregada', audiencias: 9 },
  { assunto: 'Conversão', audiencias: 5 },
  { assunto: 'Crédito Complementar', audiencias: 1 },
  { assunto: 'Data de Início de Benefício (DIB)', audiencias: 3 },
  { assunto: 'Declaração de Ausência', audiencias: 1 },
  { assunto: 'Desconto em Folha de Pagamento/Benefício Previdenciário', audiencias: 2 },
  { assunto: 'Descontos Indevidos', audiencias: 1 },
  { assunto: 'Empregada Doméstica', audiencias: 1 },
  { assunto: 'Empréstimo consignado', audiencias: 5 },
  { assunto: 'Estudante Universitário', audiencias: 21 },
  { assunto: 'Filho Maior e Inválido', audiencias: 17 },
  { assunto: 'Idoso', audiencias: 3 },
  { assunto: 'Incapacidade Laborativa Parcial', audiencias: 6 },
  { assunto: 'Incapacidade Laborativa Permanente', audiencias: 9 },
  { assunto: 'Incapacidade Laborativa Temporária', audiencias: 5 },
  { assunto: 'Indenização por Dano Moral', audiencias: 3 },
  { assunto: 'Menor sob Guarda', audiencias: 15 },
  { assunto: 'Óbito de Companheiro/Companheira', audiencias: 332 },
  { assunto: 'Óbito de Cônjuge', audiencias: 98 },
  { assunto: 'Óbito de Filho/Filha', audiencias: 8 },
  { assunto: 'Óbito de Pai/Mãe', audiencias: 60 },
  { assunto: 'Parcelas de benefício não pagas', audiencias: 3 },
  { assunto: 'Pensão por Morte (Art. 74/9)', audiencias: 1172 },
  { assunto: 'Pessoa com Deficiência', audiencias: 88 },
  { assunto: 'Professor', audiencias: 2 },
  { assunto: 'Regra de Transição para Aposentadoria - "Pedágio"', audiencias: 1 },
  { assunto: 'Renda Mensal Vitalícia', audiencias: 1 },
  { assunto: 'Rescisão do contrato e devolução do dinheiro', audiencias: 1 },
  { assunto: 'Restabelecimento', audiencias: 19 },
  { assunto: 'Restituição ao Erário', audiencias: 1 },
  { assunto: 'RMI - Renda Mensal Inicial', audiencias: 1 },
  { assunto: 'RMI sem incidência de Teto Limitador', audiencias: 1 },
  { assunto: 'Rural (art. 42/44)', audiencias: 50 },
  { assunto: 'Rural (art. 59/63)', audiencias: 301 },
  { assunto: 'Rural (Pensão por Morte (Art. 74/9))', audiencias: 24 },
  { assunto: 'Salário-Maternidade', audiencias: 10 },
  { assunto: 'Salário-Maternidade (Art. 71/73)', audiencias: 2842 },
  { assunto: 'Seguro-defeso ao pescado artesanal profissional', audiencias: 32 },
  { assunto: 'Seringueiro', audiencias: 1 },
  { assunto: 'Tempo de Serviço Rural/Contribuições não Recolhidas', audiencias: 1 },
  { assunto: 'Urbana (art. 42/44)', audiencias: 4 },
  { assunto: 'Urbana (Pensão por Morte (Art. 74/9))', audiencias: 16 },
  { assunto: 'Urbano (art. 60)', audiencias: 10 }
];

const audienceYearData: AudienceYearMetric[] = [
  { ano: 2019, audiencias: 8542 },
  { ano: 2020, audiencias: 12780 },
  { ano: 2021, audiencias: 15632 },
  { ano: 2022, audiencias: 18245 },
  { ano: 2023, audiencias: 22156 },
  { ano: 2024, audiencias: 25489 }
];

const mockData: DashboardData = {
  metrics: [
    {
      id: 'revenue',
      title: 'Pautas',
      value: '23453',
      change: '+4.5%',
      changeType: 'positive',
      description: ''
    },
    {
      id: 'avg-order',
      title: 'Audiências',
      value: '1453455',
      change: '-0.5%',
      changeType: 'positive',
      description: ''
    },
    {
      id: 'tickets',
      title: 'Avaliadores',
      value: '10',
      change: '',
      changeType: 'positive',
      description: ''
    },

  
  ],
  states: brazilMockStates,
  recentOrders: [
    {
      orderNumber: '3000',
      purchaseDate: 'May 9, 2024',
      customer: 'Leslie Alexander',
      event: 'Bear Hug: Live in Concert',
      amount: 'US$80.00'
    },
    {
      orderNumber: '3001',
      purchaseDate: 'May 5, 2024',
      customer: 'Michael Foster',
      event: 'Six Fingers — DJ Set',
      amount: 'US$299.00'
    },
    {
      orderNumber: '3002',
      purchaseDate: 'Apr 28, 2024',
      customer: 'Dries Vincent',
      event: 'We All Look The Same',
      amount: 'US$150.00'
    },
    {
      orderNumber: '3003',
      purchaseDate: 'Apr 23, 2024',
      customer: 'Lindsay Walton',
      event: 'Bear Hug: Live in Concert',
      amount: 'US$80.00'
    },
    {
      orderNumber: '3004',
      purchaseDate: 'Apr 18, 2024',
      customer: 'Courtney Henry',
      event: 'Viking People',
      amount: 'US$114.99'
    },
    {
      orderNumber: '3005',
      purchaseDate: 'Apr 14, 2024',
      customer: 'Tom Cook',
      event: 'Six Fingers — DJ Set',
      amount: 'US$299.00'
    },
    {
      orderNumber: '3006',
      purchaseDate: 'Apr 10, 2024',
      customer: 'Whitney Francis',
      event: 'We All Look The Same',
      amount: 'US$150.00'
    },
    {
      orderNumber: '3007',
      purchaseDate: 'Apr 6, 2024',
      customer: 'Leonard Krasner',
      event: 'Bear Hug: Live in Concert',
      amount: 'US$80.00'
    }
  ]
};

const MetricCardComponent: React.FC<{ metric: MetricCard }> = ({ metric }) => {
  const TrendIcon = metric.changeType === 'positive' ? TrendingUp : TrendingDown;
  
  return (
    <div className="metric-card">
      <div className="metric-card__header">
        <h3 className="metric-card__title">{metric.title}</h3>
      </div>
      <div className="metric-card__content">
        <div className="metric-card__value">{metric.value}</div>
        <div className={`metric-card__change metric-card__change--${metric.changeType}`}>
          <TrendIcon size={16} />
          <span>{metric.change}</span>
          <span className="metric-card__description">{metric.description}</span>
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ data = mockData }) => {
  const { userData } = useAuthorization();

  const hour = new Date().getHours();
  const greeting = hour >= 5 && hour < 12
    ? 'Bom dia'
    : hour >= 12 && hour < 18
      ? 'Boa tarde'
      : 'Boa noite';

  const rawName = userData?.nome?.trim() ?? '';
  const displayName = rawName ? rawName.split(' ')[0] : 'Usuário';
  const formattedName = displayName
    ? displayName.charAt(0).toUpperCase() + displayName.slice(1).toLocaleLowerCase('pt-BR')
    : 'Usuário';

  return (
    <Layout>
      <header className="dashboard__header">
        <h1 className="dashboard__title">{`${greeting}, ${formattedName}`}</h1>
        <div className="dashboard__controls">
          <select className="dashboard__select">
            <option value="last-week">Last week</option>
            <option value="last-month">Last month</option>
            <option value="last-year">Last year</option>
          </select>
        </div>
      </header>

      <section className="dashboard__overview">
        <h2 className="dashboard__section-title">Overview</h2>
        
        <div className="dashboard__metrics">
          {data.metrics.map((metric) => (
            <MetricCardComponent key={metric.id} metric={metric} />
          ))}
        </div>
      </section>

      <section className="dashboard__map-section">
        <div className="dashboard__map-layout">
          <div className="dashboard__map-card">
            <div className="dashboard__map-header">
              <h2 className="dashboard__section-title">Distribuição de audiências</h2>
              <span className="dashboard__map-subtitle">Passe o mouse sobre um estado para ver os detalhes</span>
            </div>
            <MapaBrasil data={data.states} />
          </div>

          <AudienceSubjectBarChart data={audienceSubjectData} />
        </div>
      </section>

      <section className="dashboard__year-chart">
        <AudienceYearChart data={audienceYearData} />
      </section>
    </Layout>
  );
};

export default Dashboard;