import React from 'react';
import Layout from '../Layout';
import './Orders.css';

const Orders: React.FC = () => {
  return (
    <Layout>
      <header className="orders__header">
        <h1 className="orders__title">Orders</h1>
      </header>

      <div className="orders__empty">
        <p className="orders__empty-text">Orders page content will be added here.</p>
      </div>
    </Layout>
  );
};

export default Orders;