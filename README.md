# Supply Chain Visibility Platform (SCVP)

<div align="center">

![SCVP Logo](https://img.shields.io/badge/SCVP-Supply%20Chain%20Platform-blue?style=for-the-badge)

[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)

**A modern, full-stack supply chain management platform with real-time GPS tracking, AI-powered delay prediction, and intuitive dashboard.**

[Features](#features) • [Quick Start](#quick-start) • [Architecture](#architecture) • [API Documentation](#api-documentation) • [Contributing](#contributing)

</div>

---

## 🌟 Features

### 🚚 **Real-time Shipment Tracking**
- **GPS Simulation**: Automatic location updates every 2 minutes along realistic routes
- **Status Management**: Smart status updates (pending → in_transit → delayed/delivered)
- **Event Timeline**: Complete audit trail of all shipment activities
- **Live Dashboard**: Real-time updates with 10-second auto-refresh

### 🤖 **AI-Powered Insights**
- **Delay Prediction**: Machine learning model predicts shipment delays
- **Risk Assessment**: Categorizes shipments by risk level (LOW/MEDIUM/HIGH)
- **Smart Notifications**: Proactive alerts for potential issues
- **Historical Analysis**: Learn from past shipment patterns

### 🎨 **Modern User Interface**
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark/Light Theme**: Toggle between themes with system preference detection
- **Glass Morphism**: Modern, elegant design with smooth animations
- **Intuitive Navigation**: User-friendly interface with minimal learning curve

### 🔐 **Enterprise Security**
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Multi-tenant architecture with organization isolation
- **Password Security**: Bcrypt hashing with salt rounds
- **API Security**: Rate limiting and input validation

### 📊 **Comprehensive Management**
- **Shipment CRUD**: Create, read, update, delete shipments
- **Multi-type Support**: Inbound materials, outbound goods, inter-facility transfers
- **Supplier/Customer Management**: Complete stakeholder tracking
- **Export Capabilities**: Data export for reporting and analysis

---

## 🚀 Quick Start

### Prerequisites

- **Docker** (v20.0+) - [Install Docker](https://docs.docker.com/get-docker/)
- **Docker Compose** (v2.0+) - [Install Docker Compose](https://docs.docker.com/compose/install/)
- **Git** - [Install Git](https://git-scm.com/downloads)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/PiyushBharambe/supply_chain_visibility_platform.git
   cd scvp
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your preferred settings (optional - defaults work for development)
   ```

3. **Start the application**
   ```bash
   docker-compose up -d
   ```

4. **Initialize the database**
   ```bash
   # Wait for services to start (about 30 seconds)
   docker-compose exec backend npm run migrate:latest
   docker-compose exec backend npm run seed:run
   ```

5. **Access the application**
   - **Frontend**: http://localhost:3001
   - **Backend API**: http://localhost:3000/api
   - **ML Service**: http://localhost:8000/docs
   - **Database**: localhost:5432 (postgres/password)

### Default Login Credentials

```
Email: admin@test.com
Password: testpassword
```

---

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    SCVP Architecture                        │
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │  Frontend   │    │   Backend   │    │ ML Service  │     │
│  │   React     │────│   Node.js   │────│   FastAPI   │     │
│  │   :3001     │    │   Express   │    │   Python    │     │
│  │             │    │   :3000     │    │   :8000     │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│         │                   │                              │
│         │            ┌─────────────┐    ┌─────────────┐     │
│         │            │ PostgreSQL  │    │   Redis     │     │
│         └────────────│    :5432    │    │   :6379     │     │
│                      │ (Database)  │    │  (Cache)    │     │
│                      └─────────────┘    └─────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

#### Frontend
- **React 18** - Modern UI library with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Context API** - State management for theme and auth

#### Backend
- **Node.js 18** - JavaScript runtime
- **Express.js** - Web application framework
- **Knex.js** - SQL query builder and migrations
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing

#### Database
- **PostgreSQL 15** - Primary database
- **Redis 7** - Caching and session storage

#### ML Service
- **FastAPI** - Modern Python web framework
- **scikit-learn** - Machine learning library
- **pandas** - Data manipulation

#### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy (production)

### Key Services

#### GPS Simulation Service
- Runs every 2 minutes
- Simulates realistic shipment movement
- Updates locations along predefined routes
- Manages shipment status transitions

#### Background Services
- **Event Cleanup**: Maintains latest 3 GPS events per shipment
- **Status Updates**: Automatic status changes based on delivery times
- **Cache Management**: Redis-based caching for performance

---

## 📡 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/me` | Get current user |

### Shipment Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/shipments` | List all shipments |
| POST | `/api/shipments` | Create new shipment |
| GET | `/api/shipments/:id` | Get shipment details |
| PUT | `/api/shipments/:id` | Update shipment |
| DELETE | `/api/shipments/:id` | Delete shipment |

### Event Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/shipments/:id/events` | Get shipment events |
| POST | `/api/shipments/:id/events` | Create new event |

### ML Service Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/predict` | Get delay prediction |
| GET | `/health` | Service health check |
| GET | `/docs` | API documentation |

### Example API Calls

#### Create Shipment
```bash
curl -X POST http://localhost:3000/api/shipments \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tracking_id": "SHIP-123456-ABC",
    "type": "inbound_raw_materials",
    "description": "Raw materials from supplier",
    "origin": "Mumbai Port",
    "destination": "Pune Warehouse",
    "scheduled_pickup_at": "2024-01-15T10:00:00Z",
    "estimated_arrival_at": "2024-01-16T14:00:00Z"
  }'
```

#### Get Delay Prediction
```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "shipment_id": "uuid-here",
    "origin": "Mumbai",
    "destination": "Pune",
    "status": "in_transit"
  }'
```

---

## 🗄️ Database Schema

### Core Tables

#### Organizations
```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  organization_id UUID REFERENCES organizations(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Shipments
```sql
CREATE TABLE shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_id VARCHAR(100) UNIQUE NOT NULL,
  type shipment_type NOT NULL,
  status shipment_status DEFAULT 'pending',
  description TEXT,
  origin VARCHAR(255),
  destination VARCHAR(255),
  scheduled_pickup_at TIMESTAMP,
  estimated_arrival_at TIMESTAMP,
  actual_pickup_at TIMESTAMP,
  actual_arrival_at TIMESTAMP,
  current_location VARCHAR(500),
  last_location_update_at TIMESTAMP,
  organization_id UUID REFERENCES organizations(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Shipment Events
```sql
CREATE TABLE shipment_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID REFERENCES shipments(id) ON DELETE CASCADE,
  event_type VARCHAR(100) NOT NULL,
  event_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  location VARCHAR(500),
  status VARCHAR(50),
  event_details JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔧 Development

### Development Setup

1. **Clone and setup**
   ```bash
   git clone https://github.com/yourusername/scvp.git
   cd scvp
   ```

2. **Start development environment**
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

3. **Install dependencies locally (optional)**
   ```bash
   cd scvp_frontend && npm install
   cd ../scvp_backend && npm install
   ```

### Available Scripts

#### Frontend
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run lint       # Lint code
```

#### Backend
```bash
npm start          # Start server
npm run dev        # Start with nodemon
npm run migrate    # Run database migrations
npm run seed       # Seed database
npm test           # Run tests
```

### Environment Variables

#### Frontend (.env)
```bash
REACT_APP_API_BASE_URL=http://localhost:3000/api
REACT_APP_ML_SERVICE_URL=http://localhost:8000
```

#### Backend (.env)
```bash
NODE_ENV=development
PORT=3000
DB_HOST=postgres
DB_PORT=5432
DB_NAME=scvp_db
DB_USER=postgres
DB_PASSWORD=password
JWT_SECRET=your-secret-key
REDIS_URL=redis://redis:6379
```

### Testing

```bash
# Run all tests
docker-compose exec backend npm test
docker-compose exec frontend npm test

# Run specific test file
docker-compose exec backend npm test -- auth.test.js

# Run tests with coverage
docker-compose exec backend npm run test:coverage
```

---

## 📊 Monitoring and Logging

### Health Checks

- **Backend**: http://localhost:3000/api/health
- **ML Service**: http://localhost:8000/health
- **Database**: Built-in PostgreSQL health checks

### Logging

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend

# View last 100 lines
docker-compose logs --tail=100 backend
```

### Performance Monitoring

```bash
# Check container resource usage
docker stats

# Database performance
docker-compose exec postgres psql -U postgres -d scvp_db -c "
  SELECT schemaname,tablename,pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size 
  FROM pg_tables 
  WHERE schemaname='public' 
  ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
"
```

---

## 🚀 Deployment

### Production Deployment

1. **Prepare production environment**
   ```bash
   cp .env.example .env.production
   # Edit .env.production with production values
   ```

2. **Build and deploy**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

3. **Run migrations**
   ```bash
   docker-compose -f docker-compose.prod.yml exec backend npm run migrate:latest
   ```

### Environment-specific Configurations

#### Development
- Hot reloading enabled
- Debug logging
- Development database seeds

#### Production
- Optimized builds
- Error logging only
- SSL/TLS encryption
- Load balancing
- Database backups

### Scaling

```bash
# Scale backend service
docker-compose up --scale backend=3

# Scale with load balancer
docker-compose -f docker-compose.prod.yml up --scale backend=3 --scale frontend=2
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Add tests** for new functionality
5. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
6. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Code Style

- **Frontend**: ESLint + Prettier
- **Backend**: ESLint + Node.js best practices
- **Commits**: Conventional commit messages

### Testing Requirements

- Unit tests for new functions
- Integration tests for API endpoints
- E2E tests for critical user flows

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **React Team** - For the amazing React framework
- **Express.js** - For the robust web framework
- **PostgreSQL** - For the reliable database
- **Docker** - For containerization technology
- **Tailwind CSS** - For the utility-first CSS framework
- **FastAPI** - For the modern Python web framework

---

## 📞 Support

- **Documentation**: Check the `/docs` folder for detailed documentation
- **Issues**: Report bugs via [GitHub Issues](https://github.com/yourusername/scvp/issues)
- **Discussions**: Join discussions in [GitHub Discussions](https://github.com/yourusername/scvp/discussions)

---

## 🗺️ Roadmap

### Phase 1 ✅ (Completed)
- [x] Basic shipment management
- [x] User authentication
- [x] GPS simulation
- [x] Real-time dashboard
- [x] AI delay prediction

### Phase 2 🚧 (In Progress)
- [ ] Mobile application
- [ ] Advanced analytics
- [ ] Email notifications
- [ ] API rate limiting
- [ ] Advanced search and filtering

### Phase 3 📋 (Planned)
- [ ] Multi-language support
- [ ] Advanced reporting
- [ ] Third-party integrations
- [ ] Blockchain tracking
- [ ] IoT sensor integration

---

<div align="center">

**Built with ❤️ by the SCVP Team**

[⬆ Back to Top](#supply-chain-visibility-platform-scvp)

</div>
