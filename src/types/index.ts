export interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  href?: string;
  isActive?: boolean;
}

export interface MetricCard {
  id: string;
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  description: string;
}

export interface Order {
  orderNumber: string;
  purchaseDate: string;
  customer: string;
  event: string;
  amount: string;
}

export interface DashboardData {
  metrics: MetricCard[];
  recentOrders: Order[];
}