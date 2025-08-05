// Backend Constants

const SHIPMENT_STATUSES = {
  PENDING: 'pending',
  IN_TRANSIT: 'in_transit',
  DELAYED: 'delayed',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

const SHIPMENT_TYPES = {
  INBOUND_RAW_MATERIALS: 'inbound_raw_materials',
  OUTBOUND_FINISHED_GOODS: 'outbound_finished_goods'
};

const USER_ROLES = {
  ADMIN: 'admin',
  LOGISTICS_MANAGER: 'logistics_manager',
  VIEWER: 'viewer'
};

const EVENT_TYPES = {
  GPS_UPDATE: 'gps_update',
  STATUS_CHANGE: 'status_change',
  LOCATION_UPDATE: 'location_update',
  MANUAL_UPDATE: 'manual_update'
};

const ROUTES = {
  'Mumbai → Pune': ['Mumbai', 'Navi Mumbai', 'Panvel', 'Khalapur', 'Lonavala', 'Pune'],
  'Delhi → Bangalore': ['Delhi', 'Gurgaon', 'Jaipur', 'Indore', 'Nagpur', 'Hyderabad', 'Bangalore'],
  'Chennai → Kolkata': ['Chennai', 'Bangalore', 'Hyderabad', 'Nagpur', 'Raipur', 'Bhubaneswar', 'Kolkata']
};

const CACHE_KEYS = {
  SHIPMENTS: (orgId) => `shipments:${orgId}`,
  USER: (userId) => `user:${userId}`,
  ORGANIZATION: (orgId) => `organization:${orgId}`
};

const CACHE_TTL = {
  SHORT: 300,    // 5 minutes
  MEDIUM: 1800,  // 30 minutes
  LONG: 3600     // 1 hour
};

module.exports = {
  SHIPMENT_STATUSES,
  SHIPMENT_TYPES,
  USER_ROLES,
  EVENT_TYPES,
  ROUTES,
  CACHE_KEYS,
  CACHE_TTL
};