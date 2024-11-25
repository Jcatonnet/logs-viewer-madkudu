### Logs Viewer Application
A full-stack application for visualizing and analyzing log data with filtering, sorting, and graphical representations.

#### Deployment
The application is configured for deployment on Vercel with separate frontend and backend services.
the production app can be accessed here: [https://logs-viewer-madkudu-fe.vercel.app/](https://logs-viewer-madkudu-fe.vercel.app/)

### Architecture
#### Frontend (React + TypeScript)
- Built with Vite
- Component-based architecture with React hooks for state management
- Real-time data visualization using Recharts
- Authentication using Auth0
- Bootstrap for UI design
  
Key components:
LogsList: Main table view with filtering and pagination
GraphsPage: Data visualization with multiple chart types
LogsTable: Sortable table with memoized rows for performance

#### Backend (Node.js + Express + TypeScript)
- RESTful API architecture
- MVC architecture
- PostgreSQL database with Prisma ORM
- JWT-based authentication
- CORS enabled for secure cross-origin requests

Key features:
Pagination and filtering
Data aggregation for analytics
Service and level aggregate

### Current Features
- Log viewing with pagination
- Filtering by service, level, and message
- Sorting by any column
- Data visualization with:
  - Service distribution
  - Level distribution
  - Top messages
- CSV file upload
- Secure authentication

### Suggested Improvements
#### Features
- Filter logs by custom date/time ranges
- Graph view by date/time ranges
- Saved filters and views
- Email/ Slack alerts for critical logs
- Real-time Log Streaming
- Mark as treated on logs
- Machine Learning Insights (patterns, anomaly detection, forecast)
- Advanced metrics
- Automatic reports
  
#### Performance Optimizations
  - Virtual scrolling for large datasets
  - Cache strategy
  - Better state management (Redux)
  - Optimized data fetching
  - SEO optimization

####  Enhanced User Experience
- Better error handling and messages
- Improved UI

### Setup and Installation

```
# Frontend
cd client
npm install
npm run dev

# Backend
cd server
npm install
npx prisma migrate dev
npm run dev
```

