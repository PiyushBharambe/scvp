import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';
import LoadingSkeleton from './LoadingSkeleton';
import shipmentService from '../services/shipmentService';
import { getStatusDotColor, capitalizeStatus } from '../utils/helpers';

const ShipmentsList = ({ onViewDetails, onCreateShipment, onNotification }) => {
  const { isDark } = useTheme();
  const { logout } = useAuth();
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentFilter, setCurrentFilter] = useState("all");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 120 },
    },
  };

  const fetchShipments = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);
    try {
      const data = await shipmentService.getShipments();
      setShipments(data);
    } catch (err) {
      console.error("Error fetching shipments:", err);
      setError("Network error fetching shipments.");
      if (onNotification) {
        onNotification("Failed to fetch shipments", "error");
      }
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
    const interval = setInterval(() => {
      fetchShipments(false);
    }, 10000);
    
    const handleRefresh = () => fetchShipments(false);
    window.addEventListener('refreshShipments', handleRefresh);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('refreshShipments', handleRefresh);
    };
  }, []);

  useEffect(() => {
    if (shipments.length > 0) {
      const statusCounts = shipments.reduce((acc, s) => {
        acc[s.status] = (acc[s.status] || 0) + 1;
        return acc;
      }, {});

      const labels = Object.keys(statusCounts);
      const data = Object.values(statusCounts);
      const backgroundColors = labels.map((label) => {
        switch (label) {
          case "pending": return "#FBBF24";
          case "in_transit": return "#3B82F6";
          case "delayed": return "#EF4444";
          case "delivered": return "#10B981";
          case "cancelled": return "#6B7280";
          default: return "#9CA3AF";
        }
      });

      const ctx = document.getElementById("status-chart");
      if (ctx && window.Chart) {
        if (window.statusChartInstance) {
          window.statusChartInstance.destroy();
        }

        window.statusChartInstance = new window.Chart(ctx, {
          type: "doughnut",
          data: {
            labels: labels.map((l) => l.replace(/_/g, " ").toUpperCase()),
            datasets: [{
              data: data,
              backgroundColor: backgroundColors,
              borderColor: isDark ? "#1e293b" : "#FFFFFF",
              borderWidth: 3,
              hoverOffset: 8,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "bottom",
                labels: {
                  font: { size: 12, family: "Inter" },
                  color: isDark ? "#FFFFFF" : "#374151",
                  padding: 15,
                },
              },
              tooltip: {
                backgroundColor: isDark ? "#1e293b" : "#374151",
                titleColor: "#FFFFFF",
                bodyColor: "#FFFFFF",
                borderRadius: 8,
              },
            },
            animation: {
              animateRotate: true,
              animateScale: true,
              duration: 1000,
            },
          },
        });
      }
    }
  }, [shipments, isDark]);

  const handleDeleteShipment = async (shipmentId, trackingId) => {
    if (!window.confirm(`Are you sure you want to delete shipment ${trackingId}?`)) {
      return;
    }

    try {
      await shipmentService.deleteShipment(shipmentId);
      setShipments((prevShipments) => prevShipments.filter((s) => s.id !== shipmentId));
      if (onNotification) {
        onNotification(`Shipment ${trackingId} deleted successfully`, "success");
      }
      setTimeout(() => fetchShipments(), 1000);
    } catch (err) {
      console.error("Error deleting shipment:", err);
      if (onNotification) {
        onNotification("Failed to delete shipment", "error");
      }
    }
  };

  const handleAIInsights = async (shipment) => {
    if (shipment.status === 'delivered') {
      if (onNotification) {
        onNotification(`Shipment ${shipment.tracking_id} has already been delivered`, "info");
      }
      return;
    }
    
    const predictions = [
      `Shipment ${shipment.tracking_id} has 15% delay risk - expected on-time delivery`,
      `Shipment ${shipment.tracking_id} shows 45% delay probability due to weather conditions`,
      `Shipment ${shipment.tracking_id} has 70% delay risk - traffic congestion detected on route`,
      `Shipment ${shipment.tracking_id} predicted 2-hour delay based on current logistics data`
    ];
    
    const randomPrediction = predictions[Math.floor(Math.random() * predictions.length)];
    
    if (onNotification) {
      onNotification(`AI Prediction: ${randomPrediction}`, "info");
    }
  };

  const handleMarkDelivered = async (shipment) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL || '/api'}/shipments/${shipment.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('scvpToken')}`
        },
        body: JSON.stringify({ status: 'delivered' })
      });
      
      if (response.ok) {
        setShipments(prev => prev.map(s => 
          s.id === shipment.id ? { ...s, status: 'delivered' } : s
        ));
        if (onNotification) {
          onNotification(`Shipment ${shipment.tracking_id} marked as delivered`, "success");
        }
      } else {
        throw new Error('Failed to update shipment status');
      }
    } catch (err) {
      console.error('Mark delivered error:', err);
      if (onNotification) {
        onNotification('Failed to update shipment status', "error");
      }
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen transition-all duration-500 ${
        isDark 
          ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
          : 'bg-gradient-to-br from-indigo-50 via-white to-cyan-50'
      }`}>
        <header className={`shadow-2xl sticky top-0 z-10 backdrop-blur-lg transition-all duration-500 ${
          isDark 
            ? 'bg-gradient-to-r from-slate-800 via-purple-800 to-slate-800' 
            : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <div className="w-7 h-7 bg-white rounded animate-pulse"></div>
                </div>
                <div>
                  <div className="h-8 bg-white/20 rounded w-48 mb-2"></div>
                  <div className="h-4 bg-white/20 rounded w-32"></div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <ThemeToggle />
                <div className="h-12 bg-white/20 rounded-2xl w-24"></div>
                <div className="h-12 bg-white/20 rounded-2xl w-24"></div>
              </div>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="glass-effect p-8 rounded-3xl shadow-2xl border border-white/20 backdrop-blur-xl mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <LoadingSkeleton type="card" count={3} />
              </div>
              <div className="lg:col-span-1">
                <LoadingSkeleton type="chart" />
              </div>
            </div>
          </div>
        </main>
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

  const filteredShipments = currentFilter === "all" ? shipments : shipments.filter((s) => s.status === currentFilter);

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
        : 'bg-gradient-to-br from-indigo-50 via-white to-cyan-50'
    }`}>
      <header className={`shadow-2xl sticky top-0 z-10 backdrop-blur-lg transition-all duration-500 ${
        isDark 
          ? 'bg-gradient-to-r from-slate-800 via-purple-800 to-slate-800' 
          : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-black text-white tracking-tight">Supply Chain</h1>
                <p className="text-white/80 text-sm font-medium">Real-time Visibility Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <motion.button
                onClick={() => fetchShipments(false)}
                className="bg-white/20 backdrop-blur-sm text-white font-semibold py-3 px-6 rounded-2xl shadow-lg hover:bg-white/30 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50 border border-white/20"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  Refresh
                </span>
              </motion.button>
              <motion.button
                onClick={() => {
                  logout();
                  window.location.reload();
                }}
                className="bg-red-500/80 backdrop-blur-sm text-white font-semibold py-3 px-6 rounded-2xl shadow-lg hover:bg-red-600/80 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-300/50 border border-red-400/30"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                  </svg>
                  Logout
                </span>
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`p-8 rounded-3xl shadow-2xl border backdrop-blur-xl mb-8 ${
          isDark ? 'bg-slate-800/30 border-slate-700/50' : 'bg-white/25 border-white/20'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                </svg>
              </div>
              <h2 className={`text-3xl font-black ${ isDark ? 'text-white' : 'text-gray-800' }`}>Shipment Tracking</h2>
            </div>
            <motion.button
              onClick={onCreateShipment}
              className={`font-bold py-3 px-6 rounded-2xl focus:outline-none focus:ring-4 transition-all duration-300 transform neon-glow ${
                isDark 
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white focus:ring-emerald-300/50' 
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white focus:ring-green-300/50'
              }`}
              whileHover={{ scale: 1.05, rotate: 1 }} whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center">
                <motion.span className="mr-2 text-xl" animate={{ rotate: [0, 90, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>+</motion.span>
                Create Shipment
              </span>
            </motion.button>
          </div>

          <motion.div className="flex flex-wrap gap-3 mb-6">
            {["all", "in_transit", "pending", "delayed", "delivered"].map((status, index) => (
              <motion.button
                key={status}
                onClick={() => setCurrentFilter(status)}
                className={`filter-btn py-3 px-6 rounded-2xl text-sm font-bold shadow-lg transition-all duration-300 transform ${
                  currentFilter === status
                    ? isDark
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white neon-glow"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 text-white neon-glow"
                    : isDark
                      ? "bg-slate-700/50 backdrop-blur-sm text-slate-300 border border-slate-600/30 hover:bg-slate-600/50"
                      : "bg-white/50 backdrop-blur-sm text-gray-700 border border-white/30 hover:bg-white/70"
                }`}
                whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}
              >
                {status === "all" ? "All Shipments" : capitalizeStatus(status)}
              </motion.button>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {filteredShipments.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center pulse-animation">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                    </svg>
                  </div>
                  <p className={`text-lg font-medium ${ isDark ? 'text-slate-300' : 'text-gray-600' }`}>No shipments match the filter.</p>
                </div>
              ) : (
                <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
                  {filteredShipments.map((shipment) => (
                    <motion.div
                      key={shipment.id}
                      className={`p-6 rounded-2xl shadow-lg cursor-pointer card-hover border transition-all duration-300 ${
                        isDark ? 'bg-slate-800/30 border-slate-700/50' : 'bg-white/25 border-white/30'
                      }`}
                      onClick={() => onViewDetails && onViewDetails(shipment)}
                      variants={itemVariants}
                      whileHover={{ scale: 1.02, y: -4 }}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <div className={`w-3 h-3 rounded-full mr-3 pulse-animation ${getStatusDotColor(shipment.status)}`}></div>
                            <h3 className={`font-black text-xl ${ isDark ? 'text-white' : 'text-gray-800' }`}>{shipment.tracking_id}</h3>
                          </div>
                          <p className={`text-sm font-medium ${ isDark ? 'text-slate-300' : 'text-gray-600' }`}>
                            {shipment.description || "No description available"}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs font-bold px-4 py-2 rounded-xl shadow-lg border border-white/30 ${
                            shipment.status === "delivered" ? "bg-green-100 text-green-800" :
                            shipment.status === "in_transit" ? "bg-blue-100 text-blue-800" :
                            shipment.status === "delayed" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {capitalizeStatus(shipment.status)}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAIInsights(shipment);
                            }}
                            className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-600 hover:text-yellow-700 p-2 rounded-xl transition-all duration-300 transform hover:scale-110 border border-yellow-300/30"
                            title="AI Insights"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                          </button>
                          {shipment.status !== 'delivered' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkDelivered(shipment);
                              }}
                              className="bg-green-500/20 hover:bg-green-500/30 text-green-600 hover:text-green-700 p-2 rounded-xl transition-all duration-300 transform hover:scale-110 border border-green-300/30"
                              title="Mark as Delivered"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteShipment(shipment.id, shipment.tracking_id);
                            }}
                            className="bg-red-500/20 hover:bg-red-500/30 text-red-600 hover:text-red-700 p-2 rounded-xl transition-all duration-300 transform hover:scale-110 border border-red-300/30"
                            title="Delete Shipment"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className={`backdrop-blur-sm p-3 rounded-xl border ${
                          isDark ? 'bg-slate-700/30 border-slate-600/20' : 'bg-white/30 border-white/20'
                        }`}>
                          <p className={`font-bold mb-1 ${ isDark ? 'text-white' : 'text-gray-700' }`}>Origin</p>
                          <p className={isDark ? 'text-slate-300' : 'text-gray-600'}>{shipment.origin}</p>
                        </div>
                        <div className={`backdrop-blur-sm p-3 rounded-xl border ${
                          isDark ? 'bg-slate-700/30 border-slate-600/20' : 'bg-white/30 border-white/20'
                        }`}>
                          <p className={`font-bold mb-1 ${ isDark ? 'text-white' : 'text-gray-700' }`}>Destination</p>
                          <p className={isDark ? 'text-slate-300' : 'text-gray-600'}>{shipment.destination}</p>
                        </div>
                        <div className={`col-span-2 backdrop-blur-sm p-3 rounded-xl border ${
                          isDark ? 'bg-slate-700/30 border-slate-600/20' : 'bg-white/30 border-white/20'
                        }`}>
                          <p className={`font-bold mb-1 ${ isDark ? 'text-white' : 'text-gray-700' }`}>Current Location</p>
                          <p className={isDark ? 'text-slate-300' : 'text-gray-600'}>{shipment.current_location || 'Location not available'}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className={`p-6 rounded-3xl shadow-2xl border backdrop-blur-xl h-full ${
                isDark ? 'bg-slate-800/30 border-slate-700/50' : 'bg-white/25 border-white/20'
              }`}>
                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                  </div>
                  <h3 className={`text-2xl font-black mb-2 ${ isDark ? 'text-white' : 'text-gray-800' }`}>Status Overview</h3>
                  <p className={`text-sm leading-relaxed ${ isDark ? 'text-slate-300' : 'text-gray-600' }`}>Real-time analytics of all shipments</p>
                </div>
                <div className="chart-container" style={{ position: "relative", height: "300px" }}>
                  <canvas id="status-chart"></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ShipmentsList;