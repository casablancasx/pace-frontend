import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import Layout from '../Layout';
import type { DashboardData, MetricCard } from '../../types';
import './Dashboard.css';

interface DashboardProps {
  data?: DashboardData;
}

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
      title: 'Tickets sold',
      value: '5,888',
      change: '+4.5%',
      changeType: 'positive',
      description: 'from last week'
    },
  
  ],
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
  return (
    <Layout>
      <header className="dashboard__header">
        <h1 className="dashboard__title">Good afternoon, Erica</h1>
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

      <section className="dashboard__orders">
        <h2 className="dashboard__section-title">Recent orders</h2>
        
        <div className="orders-table">
          <div className="orders-table__header">
            <div className="orders-table__cell orders-table__cell--header">Order number</div>
            <div className="orders-table__cell orders-table__cell--header">Purchase date</div>
            <div className="orders-table__cell orders-table__cell--header">Customer</div>
            <div className="orders-table__cell orders-table__cell--header">Event</div>
            <div className="orders-table__cell orders-table__cell--header">Amount</div>
          </div>
          
          <div className="orders-table__body">
            {data.recentOrders.map((order) => (
              <div key={order.orderNumber} className="orders-table__row">
                <div className="orders-table__cell">{order.orderNumber}</div>
                <div className="orders-table__cell">{order.purchaseDate}</div>
                <div className="orders-table__cell">{order.customer}</div>
                <div className="orders-table__cell">{order.event}</div>
                <div className="orders-table__cell">{order.amount}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Dashboard;