import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../hooks/useAuth';
import shipmentService from '../services/shipmentService';
import mlService from '../services/mlService';
import { formatDate } from '../utils/helpers';

const ShipmentDetails = ({ shipment, onBack }) => {
  const { isDark } = useTheme();
  const { logout } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mlPrediction, setMlPrediction] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!shipment) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const eventsData = await shipmentService.getShipmentEvents(shipment.id);
        setEvents(eventsData || []);
        
        // Mock ML prediction for non-delivered shipments
        if (!['delivered', 'cancelled'].includes(shipment.status)) {
          const mockPrediction = {
            delay_hours: Math.random() * 5,
            delay_probability: Math.random(),
            risk_level: ['LOW', 'MEDIUM', 'HIGH'][Math.floor(Math.random() * 3)]
          };
          setMlPrediction(mockPrediction);
        }
      } catch (err) {
        console.error('Error fetching shipment details:', err);
        setError(err.message || 'Network error fetching shipment details.');
        // Set empty events array on error
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Auto-refresh events every 30 seconds to catch GPS updates
    const interval = setInterval(fetchData, 30000);
    
    return () => clearInterval(interval);
  }, [shipment]);

  if (!shipment) {
    return (
      <div className="text-center p-8 text-red-700">
        No shipment selected.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center p-8 text-xl text-blue-600">
        Loading shipment details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-700 bg-red-100 rounded-md m-4">
        Error: {error}
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
        : 'bg-gradient-to-br from-indigo-50 via-white to-cyan-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={onBack}
            className={`backdrop-blur-sm font-semibold py-3 px-6 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 border ${
              isDark 
                ? 'bg-slate-700/50 text-white hover:bg-slate-600/50 focus:ring-purple-300/50 border-slate-600/30' 
                : 'bg-white/20 text-gray-700 hover:bg-white/30 focus:ring-blue-300/50 border-white/30'
            }`}
          >
            ← Back to Shipments
          </button>
          <h2 className={`text-3xl font-black ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}>
            Shipment Details
          </h2>
          <div></div>
        </div>

        <div className={`glass-effect p-8 rounded-3xl shadow-2xl mb-8 border backdrop-blur-xl ${
          isDark 
            ? 'border-slate-700/50 bg-slate-800/30' 
            : 'border-white/20 bg-white/25'
        }`}>
          <h3 className={`text-2xl font-bold mb-6 ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}>
            📦 {shipment.tracking_id}
          </h3>
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${
            isDark ? 'text-slate-300' : 'text-gray-700'
          }`}>
          <p><span className="font-medium">Tracking ID:</span> {shipment.tracking_id}</p>
          <p><span className="font-medium">Type:</span> {shipment.type.replace(/_/g, ' ')}</p>
          <p><span className="font-medium">Status:</span> 
            <span className={`font-semibold ${
              shipment.status === 'delivered' ? 'text-green-600' :
              shipment.status === 'in_transit' ? 'text-blue-600' :
              shipment.status === 'delayed' ? 'text-red-600' : 'text-yellow-600'
            }`}>
              {shipment.status}
            </span>
          </p>
          <p><span className="font-medium">Description:</span> {shipment.description}</p>
          <p><span className="font-medium">Origin:</span> {shipment.origin}</p>
          <p><span className="font-medium">Destination:</span> {shipment.destination}</p>
          <p><span className="font-medium">Scheduled Pickup:</span> {formatDate(shipment.scheduled_pickup_at)}</p>
          <p><span className="font-medium">Estimated Arrival:</span> {formatDate(shipment.estimated_arrival_at)}</p>
          <p><span className="font-medium">Actual Pickup:</span> {formatDate(shipment.actual_pickup_at)}</p>
          <p><span className="font-medium">Actual Arrival:</span> {formatDate(shipment.actual_arrival_at)}</p>
          <p><span className="font-medium">Current Location:</span> {shipment.current_location || 'N/A'}</p>
          <p><span className="font-medium">Last Location Update:</span> {formatDate(shipment.last_location_update_at)}</p>
        </div>
        
          {/* ML Prediction Section */}
          {mlPrediction && (
            <div className={`mt-6 p-4 rounded-2xl border ${
              isDark 
                ? 'bg-purple-900/30 border-purple-700/50' 
                : 'bg-blue-50 border-blue-200'
            }`}>
              <h4 className={`text-lg font-semibold mb-3 ${
                isDark ? 'text-purple-300' : 'text-blue-800'
              }`}>
                🤖 AI Delay Prediction
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className={`text-2xl font-bold ${
                    isDark ? 'text-purple-400' : 'text-blue-600'
                  }`}>
                    {mlPrediction.delay_hours.toFixed(1)}h
                  </p>
                  <p className={`text-sm ${
                    isDark ? 'text-slate-400' : 'text-gray-600'
                  }`}>Predicted Delay</p>
                </div>
                <div className="text-center">
                  <p className={`text-2xl font-bold ${
                    isDark ? 'text-purple-400' : 'text-blue-600'
                  }`}>
                    {(mlPrediction.delay_probability * 100).toFixed(0)}%
                  </p>
                  <p className={`text-sm ${
                    isDark ? 'text-slate-400' : 'text-gray-600'
                  }`}>Delay Probability</p>
                </div>
                <div className="text-center">
                  <p className={`text-2xl font-bold ${
                    mlPrediction.risk_level === 'HIGH' ? 'text-red-400' :
                    mlPrediction.risk_level === 'MEDIUM' ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {mlPrediction.risk_level}
                  </p>
                  <p className={`text-sm ${
                    isDark ? 'text-slate-400' : 'text-gray-600'
                  }`}>Risk Level</p>
                </div>
              </div>
            </div>
          )}
      </div>

        <div className={`glass-effect p-8 rounded-3xl shadow-2xl border backdrop-blur-xl ${
          isDark 
            ? 'border-slate-700/50 bg-slate-800/30' 
            : 'border-white/20 bg-white/25'
        }`}>
          <h3 className={`text-2xl font-bold mb-6 ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}>
            📋 Shipment Events
          </h3>
        {!events || events.length === 0 ? (
            <p className={`text-center text-lg ${
              isDark ? 'text-slate-400' : 'text-gray-600'
            }`}>
              {loading ? 'Loading events...' : 'No events recorded for this shipment.'}
            </p>
        ) : (
          <div className="space-y-4">
            {events.map((event, index) => (
              <div
                key={event.id || index}
                className={`p-4 rounded-2xl border transition-all duration-300 ${
                  isDark 
                    ? 'bg-slate-700/50 border-slate-600/30' 
                    : 'bg-white/50 border-white/30'
                }`}
              >
                <p className={`font-semibold ${
                  isDark ? 'text-white' : 'text-gray-800'
                }`}>
                  {event.event_type ? event.event_type.replace(/_/g, ' ') : 'Event'}
                </p>
                <p className={`text-sm ${
                  isDark ? 'text-slate-300' : 'text-gray-600'
                }`}>
                  <span className="font-medium">Timestamp:</span> {formatDate(event.event_timestamp || event.created_at)}
                </p>
                {event.location && (
                  <p className={`text-sm ${
                    isDark ? 'text-slate-300' : 'text-gray-600'
                  }`}>
                    <span className="font-medium">Location:</span> {event.location}
                  </p>
                )}
                {event.status && (
                  <p className={`text-sm ${
                    isDark ? 'text-slate-300' : 'text-gray-600'
                  }`}>
                    <span className="font-medium">Status:</span> {event.status}
                  </p>
                )}
                {event.event_details && (
                  <p className={`text-sm ${
                    isDark ? 'text-slate-300' : 'text-gray-600'
                  }`}>
                    <span className="font-medium">Details:</span> {typeof event.event_details === 'string' ? event.event_details : JSON.stringify(event.event_details)}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetails;