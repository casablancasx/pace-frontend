import React from 'react';
import Layout from '../Layout';
import './Events.css';

const Events: React.FC = () => {
  return (
    <Layout>
      <header className="events__header">
        <h1 className="events__title">Events</h1>
      </header>

      <div className="events__empty">
        <p className="events__empty-text">Events page content will be added here.</p>
      </div>
    </Layout>
  );
};

export default Events;