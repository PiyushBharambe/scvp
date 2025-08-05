import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./contexts/ThemeContext";
import { useAuth } from "./hooks/useAuth";
import LoginForm from "./components/LoginForm";
import ShipmentsList from "./components/ShipmentsList";
import CreateShipment from "./components/CreateShipment";
import ShipmentDetails from "./components/ShipmentDetails";
import NotificationSystem from "./components/NotificationSystem";
import FloatingActionButton from "./components/FloatingActionButton";
import { VIEWS, NOTIFICATION_TYPES } from "./constants";

const App = () => {
  const { isDark } = useTheme();
  const { user, loading: authLoading } = useAuth();
  const [currentView, setCurrentView] = useState(VIEWS.LOGIN);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = NOTIFICATION_TYPES.INFO) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  };

  // Update view based on authentication state
  useEffect(() => {
    if (user) {
      setCurrentView(VIEWS.SHIPMENTS);
    } else if (!authLoading) {
      setCurrentView(VIEWS.LOGIN);
      setSelectedShipment(null);
      setNotifications([]);
    }
  }, [user, authLoading]);

  const handleViewChange = (view, data = null) => {
    setCurrentView(view);
    if (view === VIEWS.SHIPMENT_DETAILS && data) {
      setSelectedShipment(data);
    }
  };

  // Animation variants for page transitions
  const pageVariants = {
    initial: { opacity: 0, y: 30 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -30 },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.6,
  };

  return (
    <div className={`font-sans antialiased min-h-screen transition-all duration-500 ${
      isDark ? 'text-slate-100 bg-slate-900' : 'text-gray-900 bg-gray-50'
    }`}>
      <NotificationSystem notifications={notifications} />
      
      <AnimatePresence mode="wait">
        {currentView === VIEWS.LOGIN && (
          <motion.div
            key="login"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <LoginForm onSuccess={(message) => addNotification(message, NOTIFICATION_TYPES.SUCCESS)} />
          </motion.div>
        )}
        
        {currentView === VIEWS.SHIPMENTS && (
          <motion.div
            key="shipments"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <ShipmentsList 
              onViewDetails={(shipment) => handleViewChange(VIEWS.SHIPMENT_DETAILS, shipment)}
              onCreateShipment={() => handleViewChange(VIEWS.CREATE_SHIPMENT)}
              onNotification={addNotification}
            />
            <FloatingActionButton 
              onCreateShipment={() => handleViewChange(VIEWS.CREATE_SHIPMENT)}
              onRefresh={() => window.dispatchEvent(new CustomEvent('refreshShipments'))}
            />
          </motion.div>
        )}
        
        {currentView === VIEWS.CREATE_SHIPMENT && user && (
          <motion.div
            key="createShipment"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <CreateShipment
              onBack={() => handleViewChange(VIEWS.SHIPMENTS)}
              onSuccess={(message) => {
                addNotification(message, NOTIFICATION_TYPES.SUCCESS);
                handleViewChange(VIEWS.SHIPMENTS);
              }}
            />
          </motion.div>
        )}
        
        {currentView === VIEWS.SHIPMENT_DETAILS && selectedShipment && user && (
          <motion.div
            key="shipmentDetails"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <ShipmentDetails
              shipment={selectedShipment}
              onBack={() => handleViewChange(VIEWS.SHIPMENTS)}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {authLoading && (
          <motion.div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className={`p-8 rounded-2xl shadow-2xl flex items-center backdrop-blur-lg border ${
                isDark 
                  ? 'bg-slate-800/90 border-slate-700/50' 
                  : 'bg-white/90 border-white/50'
              }`}
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <motion.svg
                className={`h-8 w-8 mr-4 ${
                  isDark ? 'text-purple-400' : 'text-blue-600'
                }`}
                viewBox="0 0 24 24"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </motion.svg>
              <span className={`text-lg font-medium ${
                isDark ? 'text-slate-200' : 'text-gray-800'
              }`}>Loading...</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;