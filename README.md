# OurBusWay 🚌

A comprehensive bus ticket booking and management system designed to provide seamless travel experiences for passengers and eff```

## 👥 Development Team

This project was developed by a talented team of developers: operations for bus operators.

## 📋 Project Overview

OurBusWay is a modern, scalable bus ticketing platform that enables:
- **Passengers**: Search routes, book tickets, manage reservations, and travel with ease
- **Bus Operators**: Manage fleets, routes, schedules, and revenue
- **Administrators**: Oversee system operations, analytics, and user management

## 📋 Requirements Analysis

### Introduction
Requirements analysis constitutes a fundamental step in designing the urban transport management system. It allows us to identify and formalize all functional and non-functional requirements that will guide the architectural and technical choices of the project. This analysis is structured around three main axes: functional requirements that describe what the system must do, non-functional requirements that define how the system must operate, and identification of actors who will interact with the system.

### 🎯 Functional Requirements

The functional requirements describe the services and functionalities that the system must offer to different users. They are grouped by business domain corresponding to future microservices.

#### User Management
The system must enable complete lifecycle management of users, including:
- **Registration**: Allow new users to create an account with their personal information (name, first name, email, phone, password)
- **Authentication**: Ensure secure connection via credentials (email/password) with session management
- **Profile Management**: Allow users to view and modify their personal information
- **Role Management**: Differentiate user types (Passenger, Driver, Administrator) with specific access rights
- **Password Recovery**: Offer a secure reset mechanism in case of forgetting
- **Logout**: Allow secure session closure

#### Ticket Management
The system must handle the entire ticket purchase and management process:
- **Ticket Purchase**: Enable online ticket purchase via secure payment process
- **History Consultation**: Allow users to view complete history of their purchases
- **Active Tickets Visualization**: Display valid and unused tickets

#### Routes and Schedules Management
The system must provide all information related to bus lines and schedules:
- **Line Consultation**: Display list of all available bus lines with their characteristics (number, name, terminus)
- **Schedule Consultation**: Present theoretical timetables for each line and stop
- **Route Search**: Enable route search between two points with calculation of possible connections

#### Real-time Geolocation
The system must offer real-time tracking of bus positions:
- **Bus Localization**: Display real-time GPS position of all buses in service
- **Cartographic Visualization**: Present buses on an interactive map (Google Maps or OpenStreetMap integration)

#### Subscription Management
The system must manage the complete lifecycle of subscriptions:
- **Offer Consultation**: Present different available subscription formulas (monthly, annual) with their conditions and rates
- **Subscription**: Enable online subscription with secure payment
- **Active Subscription Management**: Display current subscription details (type, start date, expiration date, status)
- **Renewal**: Offer possibility to renew subscription manually or automatically
- **Termination**: Allow subscription cancellation according to contractual conditions
- **Subscription History**: Maintain complete history of past subscriptions

#### Notification Service
The system must ensure proactive communication with users:
- **Disruption Alerts**: Real-time notification of delays, cancellations, or route modifications
- **Email Notifications**: Send emails for important events (purchase confirmation, subscription renewal)
- **SMS Notifications**: Send SMS for urgent alerts

### ⚡ Non-Functional Requirements

Non-functional requirements define qualitative and technical constraints that the system must respect. They are essential to guarantee quality, performance, and sustainability of the solution.

#### Performance
- The system guarantees fast response times through pagination and lazy loading mechanisms
- Optimized database queries and lightweight API responses minimize loading times and server overhead
- Geolocation data must be updated every 10-15 seconds

#### Scalability
- The application follows a microservices architecture, allowing services to be deployed and scaled independently
- Each service maintains its own database schema, facilitating horizontal scalability and data isolation

#### Security
- Authentication is managed via JWT (JSON Web Token) for secure access control
- User sessions and API calls are protected against unauthorized access
- Role-based authorizations (RBAC) ensure restricted access according to user profiles
- Sensitive data is protected in transit (via HTTPS/TLS) and at rest, ensuring confidentiality and integrity

#### Maintainability
- The system is organized in modular microservices, each responsible for a specific business domain
- Source code is managed by Git, with clear naming conventions and rigorous documentation practices
- Separation of responsibilities facilitates debugging, updates, and functionality extension

#### Interoperability
- Use of REST conventions for APIs
- OpenAPI specification for all public interfaces
- Use of JSON for data exchanges
- Ability to integrate third-party services (payment, mapping, SMS)

#### Portability and Deployment
- All services must be packaged with Docker
- Deployment and management via Kubernetes
- Architecture compatible with major cloud providers (AWS, Azure, GCP)
- Continuous integration and deployment pipeline (CI/CD)

### 👥 System Actors

The system will be used by different types of actors, whether human or external systems. Their identification helps define use cases and necessary interfaces.

#### Human Actors

**🧑‍💼 Passenger**
- **Role**: End user of the urban transport system
- **Responsibilities**: Consult schedules and available routes, purchase tickets online securely, track bus position in real-time, manage subscriptions, receive and view notifications, manage profile and preferences
- **Characteristics**: Can be authenticated for full access or anonymous for basic consultations (schedules, routes)

**🚗 Driver**  
- **Role**: Bus operator
- **Responsibilities**: View schedule and assigned routes, automatically share GPS position, report incidents, delays or technical problems, manage profile
- **Characteristics**: Always authenticated, limited access to role-related functionalities

**👨‍💼 Administrator**
- **Role**: System manager and supervisor  
- **Responsibilities**: Manage users, manage reference data for lines/stops/schedules, configure ticket and subscription rates, assign routes to drivers, view usage statistics and reports, manage complaints and incidents, configure system notifications
- **Characteristics**: High privileges, always authenticated with enhanced authentication (2FA recommended)

#### External System Actors

**💳 Payment System**
- **Role**: External financial transaction processing service
- **Responsibilities**: Process payments for ticket purchases and subscription subscriptions, manage recurring payments, validate and secure transactions

**🗺️ Geolocation and Mapping Service**
- **Role**: Geographic and cartographic data provider
- **Responsibilities**: Provide cartographic data for display, manage interactive map display, calculate routes between two points, estimate travel times

**📱 External Notification Service** 
- **Role**: Notification sending platform
- **Responsibilities**: Send transactional and informational emails, send SMS for urgent alerts

### 📊 System Sequence Diagrams

The system includes detailed sequence diagrams that illustrate the main business workflows:

#### Authentication Sequence
The authentication process follows a secure JWT-based workflow as detailed in [`UML/authentication_sequence.puml`](UML/authentication_sequence.puml). This diagram shows:
- User registration with email verification
- Secure login with JWT token generation  
- Token refresh mechanism for session management
- Password reset workflow
- Secure logout with token invalidation

#### Ticket Ordering Sequence  
The ticket purchase workflow is documented in [`UML/ticket_ordering_sequence.puml`](UML/ticket_ordering_sequence.puml). This comprehensive sequence covers:
- Route search with filtering capabilities
- Real-time seat selection and availability checking
- Secure payment processing integration
- Digital ticket generation with QR codes
- Multi-channel notification delivery (email, SMS)

These sequence diagrams serve as technical specifications for the development team and ensure consistent implementation across all microservices.

## 🏗️ System Architecture

### Microservices Architecture
The system follows a microservices architecture model with the following services:

#### Core Services
1. **API Gateway** - Entry point for all client requests, handles routing and rate limiting
2. **User Microservice** - Manages registration, authentication, profile management, and roles (passenger, driver, administrator)
3. **Ticket Microservice** - Handles complete ticket management (purchase, consultation, history) and interacts with payment service
4. **Subscription Microservice** - Enables subscription and renewal of passes (monthly or annual)
5. **Route and Schedule Microservice** - Manages routes, bus lines, schedules, and itinerary search
6. **Geolocation Microservice** - Provides real-time GPS position of buses and enables passenger tracking
7. **Notification Microservice** - Sends alerts and messages (email or SMS) to users in case of delays, incidents, or special events
8. **Incident Microservice** - Allows drivers to report delays or incidents and administrators to view their history
9. **Administration Microservice** - Centralizes system management operations (users, drivers, statistics)
10. **Payment Microservice** - Handles secure transaction processing during ticket or subscription purchases

### Security Features
- 🔐 **JWT Authentication** with access and refresh token rotation
- 🛡️ **Input Validation** and sanitization on all endpoints
- 🔒 **HTTPS Only** communication with TLS 1.3
- 🚫 **Rate Limiting** to prevent abuse and DDoS attacks
- 👤 **Role-Based Access Control** (RBAC) for different user types
- 🔑 **Password Hashing** using bcrypt with salt rounds
- 📧 **Email Verification** required for account activation
- 🎫 **Token Blacklisting** for secure logout functionality

## 🎯 Key Features

### For Passengers
- 🔍 **Smart Route Search** with filters (price, duration, amenities)
- 💺 **Interactive Seat Selection** with real-time availability
- 💳 **Multiple Payment Options** (Credit/Debit cards, Digital wallets, Mobile payments)
- 📱 **Digital Tickets** with QR codes for easy boarding
- 🔔 **Real-time Notifications** for booking confirmations and updates
<!-- - ❌ **Flexible Cancellation** with policy-based refund processing -->
- 📊 **Booking History** and travel analytics
- ⭐ **Rating & Reviews** for buses and routes

### For Bus Operators
- 📅 **Schedule tracking** with dynamic pricing capabilities
- 💰 **Revenue Analytics** and financial reporting
- 👥 **Passenger Management** with check-in capabilities
- 📈 **Incident Reporting** for vehicle incidents tracking and stuff

### For Administrators
- 🏢 **Multi-tenant Support** for different bus operators
- 📊 **System Analytics** and performance monitoring
- 👤 **User Management** with role assignments
- ⚙️ **Configuration Management** for system parameters
- 🚨 **Alert Management** for system issues and anomalies
- 🚨 **Bus schedules management and assignelement** build Routes and assign them to drivers

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js with Express.js framework
- **Database**: PostgreSQL for transactional data, Redis for caching
- **Authentication**: JWT (JSON Web Tokens) with refresh token rotation
- **API Documentation**: OpenAPI 3.0 / Swagger
- **Message Queue**: RabbitMQ for asynchronous processing
- **Payment Integration**: Stripe

### Frontend
- **Web Application**: React.js with TypeScript
- **Mobile Application**: React Native for cross-platform compatibility (if possible)
- **State Management**: Redux Toolkit with RTK Query (if possible too)
- **UI Framework**: Tailwind CSS
- **Maps Integration**: Google Maps API for route visualization (if we find better then we can change it)

### Infrastructure
- **Containerization**: Docker with Docker Compose for local development
- **Orchestration**: Kubernetes for production deployment
- **Monitoring**: Prometheus + Grafana for metrics (optional if time let us)
- **CI/CD**: GitLab CI or GitHub Actions for automated deployment

## 📊 Database Schema Overview

### Main Entities
- **Users** - Customer accounts with authentication details and roles (passenger, driver, administrator)
- **Operators** - Bus company information and identifiers
- **Buses** - Vehicle information, capacity, and equipment (assigned to a driver).
- **Routes** - Origin/destination pairs with distance and duration
- **Schedules** - Departure times and pricing for specific routes
- **Tickets** - Ticket reservations with passenger details
- **Subscriptions** - Monthly or annual subscriptions
- **Payments** - Transaction records and payment status
- **Seats** - Individual seat assignments and availability
- **Incidents** - Delay or problem reports
- **Geolocation** - Real-time GPS positions of buses

### Relationships
- Users can have multiple Tickets and Subscriptions
- Tickets belong to specific Schedules
- Schedules are associated with Routes and Buses
- Payments are linked to Tickets and Subscriptions
- Seats are managed by Bus and reserved by Ticket
- Incidents are reported by Drivers
- Geolocation tracks Buses in real-time

## 🔄 Business Workflows

### Ticket Booking Flow
1. **Route Search** - Find available buses based on criteria
2. **Seat Selection** - Choose preferred seats with real-time availability
3. **Passenger Details** - Enter traveler information
4. **Payment Processing** - Secure payment with multiple options
5. **Booking Confirmation** - Generate digital ticket with QR code
6. **Notifications** - Send confirmation via email and SMS

### Authentication Flow
1. **User Registration** - Account creation with email verification
2. **Login Process** - JWT token generation with refresh capability
3. **Token Refresh** - Automatic token renewal for session management
4. **Password Reset** - Secure password recovery via email
5. **Logout** - Token invalidation and session cleanup

## 🚀 Getting Started

### Prerequisites
- React Js
- SPRING BOOT 
- PostgreSQL (v14+)
- Docker & Docker Compose
- Git

### Local Development Setup
```bash
# Clone the repository
git clone https://github.com/AhssenQuadrinome/OurBusWay.git
cd OurBusWay

# Start services with Docker Compose
docker-compose up -d
```




### 🎖️ **Ahssen QUADRINOME** 

---

### 🚀 **Hiba ELOUERKHAOUI** 
*💼 Versatile Software Engineer*

> *"A versatile software engineer whose calm precision and detail-oriented mindset 
> brings balance to the entire team."*

**Expertise:**
- 🔧 **Software Engineering** - Robust and scalable architecture design
- 📊 **Analysis & Design** - UML modeling and technical specifications
- ✅ **Quality Assurance** - Unit testing, integration testing, and validation
- 📚 **Technical Documentation** - Writing guides and user manuals

---

### 🎯 **Abderrahmane ESSAHIH**
*🏗️ The Embodiment of DevSecOps*

> *"The embodiment of DevSecOps, blending security, 
> operations, and development into the backbone of our workflow."*

**Expertise:**
- 🔒 **Application Security** - JWT implementation, secure authentication
- ⚙️ **DevOps & Infrastructure** - Docker, CI/CD, Kubernetes orchestration  
- 🛡️ **Secure Operations** - Monitoring, alerts, and incident management
- 🔄 **Continuous Integration** - Automated deployment and testing

---

### 💻 **ZAKARIA OUMGHAR**
*⚡ The Frontend Speed Specialist*

> *"The frontend speed specialist who perfected layouts, often 
> leaving teammates wondering about how was it done.*
> Making the mood of the team better with the help of Meryem."*

**Expertise:**
- ⚛️ **React.js Expert** - Reusable components and advanced state management
- 🎨 **UI/UX Design** - Intuitive interfaces with Tailwind CSS
- 🚀 **Frontend Performance** - Loading time optimization and UX
- 🔗 **API Integration** - Smooth connection between frontend and microservices

---

### 🌟 **Meryem ELFADILI**
*🍃 The Spring Boot & Microservices Expert*

> *"The Spring Boot and microservices expert who creates seamless connections, 
> working in perfect harmony with Zakaria."*

**Expertise:**
- ☕ **Spring Boot Master** - Robust and secure REST API development
- 🏗️ **Microservices Architecture** - Modular and scalable design
- 🗄️ **Database Management** - PostgreSQL, query optimization
- 🔄 **Service Integration** - Inter-service communication and message queuing

---

## 🤝 Our Team Philosophy

> **"Combining Hazm and Mazh to transform technical challenges into innovative solutions."**

- 💡 **Collaborative Innovation** - Each member brings their unique vision
- 🎯 **Technical Excellence** - High standards and best practices
- 🌱 **Continuous Learning** - Technology watch and constant improvement
- 🚀 **Real Impact** - Solutions that improve urban transport experience

---

*Developed with passion as part of an academic project*