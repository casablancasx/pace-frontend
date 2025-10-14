// Component exports
export { default as Layout } from './Layout';
export { default as Sidebar } from './Sidebar';
export { default as Dashboard } from './Dashboard';
export { default as Events } from './Events';
export { default as Orders } from './Orders';
export { default as ImportarPlanilha } from './ImportarPlanilha';
export { default as AssuntoAutocomplete } from './AssuntoAutocomplete';

// Context exports
export { ThemeProvider, useTheme } from '../contexts/ThemeContext';
export { NavigationProvider, useNavigation } from '../contexts/NavigationContext';

// Type exports
export type { 
  SidebarItem, 
  MetricCard, 
  Order, 
  DashboardData,
  DashboardStateMetric
} from '../types';