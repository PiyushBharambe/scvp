-- Database: supply_chain_visibility

-- Table: users
-- Stores user authentication and authorization information.
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Unique identifier for the user
    email VARCHAR(255) UNIQUE NOT NULL,            -- User's email, used for login
    password_hash VARCHAR(255) NOT NULL,           -- Hashed password for security
    role VARCHAR(50) DEFAULT 'logistics_manager' NOT NULL, -- User role (e.g., 'admin', 'logistics_manager')
    organization_id UUID,                          -- Foreign key to organizations table
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table: organizations
-- Represents the SMB manufacturers using the platform.
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Unique identifier for the organization
    name VARCHAR(255) UNIQUE NOT NULL,             -- Name of the organization
    address TEXT,                                  -- Organization's physical address
    contact_email VARCHAR(255),                    -- Main contact email for the organization
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key constraint to users after organizations is created
ALTER TABLE users
ADD CONSTRAINT fk_organization
FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE SET NULL;


-- Table: suppliers
-- Stores information about suppliers providing raw materials or components.
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Unique identifier for the supplier
    organization_id UUID NOT NULL,                 -- Foreign key to the organization this supplier belongs to
    name VARCHAR(255) NOT NULL,                    -- Supplier's name
    contact_person VARCHAR(255),                   -- Main contact person at the supplier
    contact_email VARCHAR(255),                    -- Supplier's contact email
    phone_number VARCHAR(50),                      -- Supplier's phone number
    address TEXT,                                  -- Supplier's address
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_supplier_organization
        FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);

-- Table: customers
-- Stores information about customers receiving finished goods.
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Unique identifier for the customer
    organization_id UUID NOT NULL,                 -- Foreign key to the organization this customer belongs to
    name VARCHAR(255) NOT NULL,                    -- Customer's name
    contact_person VARCHAR(255),                   -- Main contact person at the customer
    contact_email VARCHAR(255),                    -- Customer's contact email
    phone_number VARCHAR(50),                      -- Customer's phone number
    address TEXT,                                  -- Customer's address
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_customer_organization
        FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);

-- Table: shipments
-- Core table for tracking individual shipments.
CREATE TABLE shipments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Unique identifier for the shipment
    organization_id UUID NOT NULL,                 -- Foreign key to the organization that owns this shipment record
    tracking_id VARCHAR(255) UNIQUE NOT NULL,      -- External tracking ID (e.g., from carrier)
    type VARCHAR(50) NOT NULL,                     -- Type of shipment (e.g., 'inbound_raw_materials', 'outbound_finished_goods')
    description TEXT,                              -- Description of the shipment content
    origin VARCHAR(255) NOT NULL,                  -- Origin location of the shipment
    destination VARCHAR(255) NOT NULL,             -- Destination location of the shipment
    scheduled_pickup_at TIMESTAMP WITH TIME ZONE,  -- Planned pickup time
    actual_pickup_at TIMESTAMP WITH TIME ZONE,     -- Actual pickup time
    estimated_arrival_at TIMESTAMP WITH TIME ZONE, -- Estimated time of arrival (ETA)
    actual_arrival_at TIMESTAMP WITH TIME ZONE,    -- Actual time of arrival
    current_location VARCHAR(255),                 -- Current known location of the shipment (textual description for MVP)
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- Current status (e.g., 'pending', 'in_transit', 'delayed', 'delivered', 'cancelled')
    supplier_id UUID,                              -- Foreign key to the associated supplier (if inbound)
    customer_id UUID,                              -- Foreign key to the associated customer (if outbound)
    last_location_update_at TIMESTAMP WITH TIME ZONE, -- Timestamp of the last location update
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_shipment_organization
        FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    CONSTRAINT fk_shipment_supplier
        FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL,
    CONSTRAINT fk_shipment_customer
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
);

-- Table: shipment_events
-- Logs historical events for each shipment (e.g., location updates, status changes).
CREATE TABLE shipment_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Unique identifier for the event
    shipment_id UUID NOT NULL,                     -- Foreign key to the shipment this event belongs to
    event_type VARCHAR(100) NOT NULL,              -- Type of event (e.g., 'location_update', 'status_change', 'delay_alert')
    location VARCHAR(255),                         -- Location associated with the event (if applicable)
    status VARCHAR(50),                            -- Status at the time of the event (if applicable)
    event_details JSONB,                           -- Flexible JSONB field for additional event-specific data (e.g., 'temperature', 'humidity')
    event_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- When the event occurred
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_event_shipment
        FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_organization_id ON users (organization_id);
CREATE INDEX idx_suppliers_organization_id ON suppliers (organization_id);
CREATE INDEX idx_customers_organization_id ON customers (organization_id);
CREATE INDEX idx_shipments_organization_id ON shipments (organization_id);
CREATE INDEX idx_shipments_tracking_id ON shipments (tracking_id);
CREATE INDEX idx_shipments_status ON shipments (status);
CREATE INDEX idx_shipments_eta ON shipments (estimated_arrival_at);
CREATE INDEX idx_shipment_events_shipment_id ON shipment_events (shipment_id);
CREATE INDEX idx_shipment_events_timestamp ON shipment_events (event_timestamp);
