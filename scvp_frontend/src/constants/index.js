// Application Constants

export const SHIPMENT_STATUSES = {
  PENDING: 'pending',
  IN_TRANSIT: 'in_transit',
  DELAYED: 'delayed',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

export const SHIPMENT_TYPES = {
  INBOUND_RAW_MATERIALS: 'inbound_raw_materials',
  OUTBOUND_FINISHED_GOODS: 'outbound_finished_goods'
};

export const STATUS_COLORS = {
  [SHIPMENT_STATUSES.PENDING]: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-500',
    dot: 'bg-yellow-400'
  },
  [SHIPMENT_STATUSES.IN_TRANSIT]: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-500',
    dot: 'bg-blue-400'
  },
  [SHIPMENT_STATUSES.DELAYED]: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-500',
    dot: 'bg-red-400'
  },
  [SHIPMENT_STATUSES.DELIVERED]: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-500',
    dot: 'bg-green-400'
  },
  [SHIPMENT_STATUSES.CANCELLED]: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-500',
    dot: 'bg-gray-400'
  }
};

export const CHART_COLORS = {
  LIGHT: {
    [SHIPMENT_STATUSES.PENDING]: '#FBBF24',
    [SHIPMENT_STATUSES.IN_TRANSIT]: '#3B82F6',
    [SHIPMENT_STATUSES.DELAYED]: '#EF4444',
    [SHIPMENT_STATUSES.DELIVERED]: '#10B981',
    [SHIPMENT_STATUSES.CANCELLED]: '#6B7280'
  },
  DARK: {
    [SHIPMENT_STATUSES.PENDING]: '#FCD34D',
    [SHIPMENT_STATUSES.IN_TRANSIT]: '#60A5FA',
    [SHIPMENT_STATUSES.DELAYED]: '#F87171',
    [SHIPMENT_STATUSES.DELIVERED]: '#34D399',
    [SHIPMENT_STATUSES.CANCELLED]: '#9CA3AF'
  }
};

export const POLLING_INTERVALS = {
  SHIPMENTS_REFRESH: 3000, // 3 seconds
  GPS_SIMULATION: 120000   // 2 minutes
};

export const ROUTES = {
  'Mumbai → Pune': ['Mumbai', 'Navi Mumbai', 'Panvel', 'Khalapur', 'Lonavala', 'Pune'],
  'Delhi → Bangalore': ['Delhi', 'Gurgaon', 'Jaipur', 'Indore', 'Nagpur', 'Hyderabad', 'Bangalore'],
  'Chennai → Kolkata': ['Chennai', 'Bangalore', 'Hyderabad', 'Nagpur', 'Raipur', 'Bhubaneswar', 'Kolkata']
};

export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning'
};

export const VIEWS = {
  LOGIN: 'login',
  SHIPMENTS: 'shipments',
  SHIPMENT_DETAILS: 'shipmentDetails',
  CREATE_SHIPMENT: 'createShipment'
};

export const SHIPMENT_STATUS_COLORS = {
  [SHIPMENT_STATUSES.PENDING]: 'bg-yellow-500',
  [SHIPMENT_STATUSES.IN_TRANSIT]: 'bg-blue-500',
  [SHIPMENT_STATUSES.DELAYED]: 'bg-red-500',
  [SHIPMENT_STATUSES.DELIVERED]: 'bg-green-500',
  [SHIPMENT_STATUSES.CANCELLED]: 'bg-gray-500'
};