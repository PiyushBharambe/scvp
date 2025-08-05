import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../hooks/useAuth';

const CreateShipment = ({ onBack, onSuccess }) => {
  const { isDark } = useTheme();
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    tracking_id: `SHIP-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substr(2, 3).toUpperCase()}`,
    type: 'inbound_raw_materials',
    description: '',
    origin: '',
    destination: '',
    status: 'pending',
    current_location: '',
    scheduled_pickup_at: '',
    estimated_arrival_at: '',
    supplier_name: '',
    customer_name: ''
  });
  const [suppliers, setSuppliers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "/api";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [suppliersRes, customersRes] = await Promise.all([
          fetch(`${API_BASE_URL}/suppliers`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${API_BASE_URL}/customers`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        if (suppliersRes.ok) {
          const suppliersData = await suppliersRes.json();
          setSuppliers(suppliersData);
        }
        if (customersRes.ok) {
          const customersData = await customersRes.json();
          setCustomers(customersData);
        }
      } catch (err) {
        console.error('Error fetching suppliers/customers:', err);
      }
    };

    fetchData();
  }, [token, API_BASE_URL]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Format dates properly
      const submitData = {
        ...formData,
        supplier_name: formData.supplier_name || null,
        customer_name: formData.customer_name || null,
        scheduled_pickup_at: formData.scheduled_pickup_at ? new Date(formData.scheduled_pickup_at).toISOString() : null,
        estimated_arrival_at: formData.estimated_arrival_at ? new Date(formData.estimated_arrival_at).toISOString() : null
      };

      const response = await fetch(`${API_BASE_URL}/shipments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(submitData)
      });

      const data = await response.json();
      if (response.ok) {
        onSuccess('Shipment created successfully!');
        // Trigger immediate refresh of shipments list
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('refreshShipments'));
        }, 500);
        onBack();
      } else {
        setError(data.message || 'Failed to create shipment');
      }
    } catch (err) {
      setError('Network error creating shipment');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className={`min-h-screen p-4 transition-all duration-500 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
        : 'bg-gradient-to-br from-indigo-50 via-white to-cyan-50'
    }`}>
      <div className="max-w-4xl mx-auto">
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
          <h2 className={`text-4xl font-black ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}>Create New Shipment</h2>
          <div></div>
        </div>

        {error && (
          <div className={`backdrop-blur-sm p-4 rounded-2xl mb-6 border ${
            isDark 
              ? 'bg-red-900/50 text-red-300 border-red-700/50' 
              : 'bg-red-500/20 text-red-700 border-red-300/30'
          }`}>
            {error}
          </div>
        )}

        <div className={`p-8 rounded-3xl shadow-2xl border backdrop-blur-xl ${
          isDark 
            ? 'bg-slate-800/30 border-slate-700/50' 
            : 'bg-white/25 border-white/20'
        }`}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-bold mb-2 ${
                isDark ? 'text-white' : 'text-gray-700'
              }`}>
                Tracking ID 
                <span className={`text-xs font-normal ml-2 ${
                  isDark ? 'text-slate-400' : 'text-gray-500'
                }`}>
                  (Auto-generated unique identifier)
                </span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="tracking_id"
                  value={formData.tracking_id}
                  readOnly
                  className={`w-full px-4 py-3 backdrop-blur-sm border rounded-2xl cursor-not-allowed transition-all duration-300 ${
                    isDark 
                      ? 'bg-slate-700/50 border-slate-600/30 text-slate-300' 
                      : 'bg-gray-100/50 border-white/30 text-gray-600'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setFormData({...formData, tracking_id: `SHIP-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substr(2, 3).toUpperCase()}`})}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-xs transition-all duration-300"
                >
                  🔄 New ID
                </button>
              </div>
            </div>

            <div>
              <label className={`block text-sm font-bold mb-2 ${
                isDark ? 'text-white' : 'text-gray-700'
              }`}>
                Shipment Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 backdrop-blur-sm border rounded-2xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 ${
                  isDark 
                    ? 'bg-slate-700/50 border-slate-600/30 text-white focus:ring-purple-400/50' 
                    : 'bg-white/30 border-white/30 text-gray-800 focus:ring-blue-400/50'
                }`}
              >
                <option value="inbound_raw_materials">Inbound Raw Materials</option>
                <option value="outbound_finished_goods">Outbound Finished Goods</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className={`block text-sm font-bold mb-2 ${
                isDark ? 'text-white' : 'text-gray-700'
              }`}>
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all duration-300 ${
                  isDark 
                    ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:ring-purple-500' 
                    : 'bg-white border-gray-300 text-gray-700 placeholder-gray-400 focus:ring-blue-500'
                }`}
                placeholder="Steel sheets for manufacturing"
              />
            </div>

            <div>
              <label className={`block text-sm font-bold mb-2 ${
                isDark ? 'text-white' : 'text-gray-700'
              }`}>
                Origin *
              </label>
              <input
                type="text"
                name="origin"
                value={formData.origin}
                onChange={handleChange}
                required
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all duration-300 ${
                  isDark 
                    ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:ring-purple-500' 
                    : 'bg-white border-gray-300 text-gray-700 placeholder-gray-400 focus:ring-blue-500'
                }`}
                placeholder="Steel Corp Warehouse, Pittsburgh, PA"
              />
            </div>

            <div>
              <label className={`block text-sm font-bold mb-2 ${
                isDark ? 'text-white' : 'text-gray-700'
              }`}>
                Destination *
              </label>
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                required
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all duration-300 ${
                  isDark 
                    ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:ring-purple-500' 
                    : 'bg-white border-gray-300 text-gray-700 placeholder-gray-400 focus:ring-blue-500'
                }`}
                placeholder="Factory, Detroit, MI"
              />
            </div>

            <div>
              <label className={`block text-sm font-bold mb-2 ${
                isDark ? 'text-white' : 'text-gray-700'
              }`}>
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all duration-300 ${
                  isDark 
                    ? 'bg-slate-700/50 border-slate-600 text-white focus:ring-purple-500' 
                    : 'bg-white border-gray-300 text-gray-700 focus:ring-blue-500'
                }`}
              >
                <option value="pending">Pending</option>
                <option value="in_transit">In Transit</option>
                <option value="delayed">Delayed</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-bold mb-2 ${
                isDark ? 'text-white' : 'text-gray-700'
              }`}>
                Current Location
                <button
                  type="button"
                  onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(
                        (position) => {
                          const { latitude, longitude } = position.coords;
                          setFormData({...formData, current_location: `GPS: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`});
                        },
                        () => {
                          setFormData({...formData, current_location: 'GPS location unavailable'});
                        }
                      );
                    }
                  }}
                  className="ml-2 text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded transition-all duration-300"
                >
                  📍 Use GPS
                </button>
              </label>
              <input
                type="text"
                name="current_location"
                value={formData.current_location}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all duration-300 ${
                  isDark 
                    ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:ring-purple-500' 
                    : 'bg-white border-gray-300 text-gray-700 placeholder-gray-400 focus:ring-blue-500'
                }`}
                placeholder="Distribution Center, Cleveland, OH"
              />
            </div>

            <div>
              <label className={`block text-sm font-bold mb-2 ${
                isDark ? 'text-white' : 'text-gray-700'
              }`}>
                Scheduled Pickup
              </label>
              <input
                type="datetime-local"
                name="scheduled_pickup_at"
                value={formData.scheduled_pickup_at}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all duration-300 ${
                  isDark 
                    ? 'bg-slate-700/50 border-slate-600 text-white focus:ring-purple-500' 
                    : 'bg-white border-gray-300 text-gray-700 focus:ring-blue-500'
                }`}
              />
            </div>

            <div>
              <label className={`block text-sm font-bold mb-2 ${
                isDark ? 'text-white' : 'text-gray-700'
              }`}>
                Estimated Arrival
              </label>
              <input
                type="datetime-local"
                name="estimated_arrival_at"
                value={formData.estimated_arrival_at}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all duration-300 ${
                  isDark 
                    ? 'bg-slate-700/50 border-slate-600 text-white focus:ring-purple-500' 
                    : 'bg-white border-gray-300 text-gray-700 focus:ring-blue-500'
                }`}
              />
            </div>

            {formData.type === 'inbound_raw_materials' && (
              <div>
                <label className={`block text-sm font-bold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-700'
                }`}>
                  Supplier Name
                </label>
                <input
                  type="text"
                  name="supplier_name"
                  value={formData.supplier_name || ''}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 backdrop-blur-sm border rounded-2xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 ${
                    isDark 
                      ? 'bg-slate-700/50 border-slate-600/30 text-white placeholder-slate-400 focus:ring-purple-400/50' 
                      : 'bg-white/30 border-white/30 text-gray-800 placeholder-gray-500 focus:ring-blue-400/50'
                  }`}
                  placeholder="Enter supplier name (e.g., Steel Corp Ltd)"
                />
              </div>
            )}

            {formData.type === 'outbound_finished_goods' && (
              <div>
                <label className={`block text-sm font-bold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-700'
                }`}>
                  Customer Name
                </label>
                <input
                  type="text"
                  name="customer_name"
                  value={formData.customer_name || ''}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 backdrop-blur-sm border rounded-2xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 ${
                    isDark 
                      ? 'bg-slate-700/50 border-slate-600/30 text-white placeholder-slate-400 focus:ring-purple-400/50' 
                      : 'bg-white/30 border-white/30 text-gray-800 placeholder-gray-500 focus:ring-blue-400/50'
                  }`}
                  placeholder="Enter customer name (e.g., Manufacturing Co)"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onBack}
              className={`backdrop-blur-sm font-semibold py-3 px-6 rounded-2xl border transition-all duration-300 transform hover:scale-105 ${
                isDark 
                  ? 'bg-slate-700/50 text-white border-slate-600/30 hover:bg-slate-600/50' 
                  : 'bg-white/50 text-gray-700 border-white/30 hover:bg-white/70'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`font-bold py-3 px-6 rounded-2xl focus:outline-none focus:ring-4 transition-all duration-300 transform hover:scale-105 neon-glow disabled:opacity-50 ${
                isDark 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white focus:ring-purple-300/50' 
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white focus:ring-blue-300/50'
              }`}
            >
              {loading ? 'Creating...' : 'Create Shipment'}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
};

export default CreateShipment;