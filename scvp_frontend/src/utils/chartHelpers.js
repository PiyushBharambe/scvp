import { CHART_COLORS } from '../constants';

export const createChartData = (shipments, isDark) => {
  const statusCounts = shipments.reduce((acc, shipment) => {
    acc[shipment.status] = (acc[shipment.status] || 0) + 1;
    return acc;
  }, {});

  const labels = Object.keys(statusCounts);
  const data = Object.values(statusCounts);
  const colors = isDark ? CHART_COLORS.DARK : CHART_COLORS.LIGHT;
  
  const backgroundColors = labels.map(label => colors[label] || '#9CA3AF');

  return {
    labels: labels.map(l => l.replace(/_/g, ' ').toUpperCase()),
    datasets: [{
      data: data,
      backgroundColor: backgroundColors,
      borderColor: isDark ? '#1e293b' : '#FFFFFF',
      borderWidth: isDark ? 2 : 3,
      hoverOffset: 8,
    }]
  };
};

export const getChartOptions = (isDark) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        font: { size: 12, family: 'Inter' },
        color: isDark ? '#FFFFFF' : '#374151',
        padding: 15,
      },
    },
    tooltip: {
      backgroundColor: isDark ? '#1e293b' : '#374151',
      titleColor: '#FFFFFF',
      bodyColor: '#FFFFFF',
      borderRadius: 8,
    },
  },
  animation: {
    animateRotate: true,
    animateScale: true,
    duration: 1000,
  },
});

export const initializeChart = (canvasId, shipments, isDark) => {
  const ctx = document.getElementById(canvasId);
  if (!ctx || !window.Chart) return null;

  // Destroy existing chart
  if (window.statusChartInstance) {
    window.statusChartInstance.destroy();
  }

  const chartData = createChartData(shipments, isDark);
  const chartOptions = getChartOptions(isDark);

  window.statusChartInstance = new window.Chart(ctx, {
    type: 'doughnut',
    data: chartData,
    options: chartOptions,
  });

  return window.statusChartInstance;
};