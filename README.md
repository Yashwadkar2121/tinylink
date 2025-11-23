# Tinylink - URL Shortener Service

A full-stack URL shortener application built with React.js frontend and Node.js backend, using PostgreSQL as the database. The application allows users to create short, memorable links from long URLs.

## 🌟 Features

### Frontend

- **Modern UI**: Clean and responsive React.js interface
- **URL Shortening**: Convert long URLs to short, shareable links
- **Link Management**: View and manage all created short links
- **Copy to Clipboard**: One-click copying of shortened URLs
- **Real-time Validation**: URL format validation before submission
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Backend

- **RESTful API**: Well-structured endpoints for URL operations
- **URL Validation**: Server-side URL verification
- **Custom Short Codes**: Support for custom alias creation
- **Analytics Ready**: Foundation for click tracking and analytics
- **CORS Enabled**: Secure cross-origin resource sharing
- **Error Handling**: Comprehensive error management

## 🚀 Live Demo

- **Frontend**: [https://tinylink.vercel.app](https://tinylink.vercel.app)
- **Backend API**: [https://tinylink-backend.onrender.com](https://tinylink-backend.onrender.com)

## 🛠️ Tech Stack

### Frontend

- **React.js** - UI framework
- **CSS3** - Styling
- **Axios** - HTTP client for API calls
- **Vercel** - Frontend hosting

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database (Neon.tech)
- **CORS** - Cross-origin middleware
- **Render** - Backend hosting

### Database

- **Neon.tech** - Serverless PostgreSQL
- **PG** - PostgreSQL client for Node.js

## 📋 Prerequisites

Before running locally, ensure you have:

- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn package manager

## 🔧 Installation & Local Development

### 1. Clone the Repository

git clone https://github.com/Yashwadkar2121/tinylink.git
cd tinylink

```
2. Backend Setup
cd backend

# Install dependencies
npm install

# Environment variables
```
Create a .env file with:
DATABASE_URL=your_neon_postgresql_connection_string
PORT=5000
NODE_ENV=development

# Start development
server
npm run dev
```
3. Frontend Setup
cd frontend

# Install dependencies
npm install

# Environment variables
Create a .env file with:
REACT_APP_API_URL=http://localhost:5000

# Start development server
npm start
```

🗄️ Database Schema
sql
CREATE TABLE links (
    id SERIAL PRIMARY KEY,
    original_url TEXT NOT NULL,
    short_code VARCHAR(10) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    click_count INTEGER DEFAULT 0
);
📡 API Endpoints
Base URL: https://tinylink-backend.onrender.com
Method	Endpoint	Description	Request Body
POST	/api/shorten	Create short URL	{ "originalUrl": "string", "customCode": "string" (optional) }
GET	/api/links	Get all links	-
GET	/:shortCode	Redirect to original URL	-
Example Usage
Create Short URL:

bash
curl -X POST https://tinylink-backend.onrender.com/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"originalUrl": "https://example.com/very-long-url"}'
Response:

json
{
  "id": 1,
  "originalUrl": "https://example.com/very-long-url",
  "shortCode": "abc123",
  "shortUrl": "https://tinylink-backend.onrender.com/abc123",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
🌐 Deployment
Backend Deployment (Render)
Push code to GitHub

Connect repository to Render

Set environment variables in Render dashboard

Deploy automatically on git push

Frontend Deployment (Vercel)
Connect GitHub repository to Vercel

Set environment variables:

REACT_APP_API_URL=https://tinylink-backend.onrender.com

Deploy automatically on git push

Database (Neon.tech)
Create account on Neon.tech

Create new PostgreSQL project

Get connection string

Add to backend environment variables

🔒 Environment Variables
Backend (.env)
env
DATABASE_URL=postgresql://username:password@ep-cool-bird-123456.us-east-2.aws.neon.tech/dbname?sslmode=require
PORT=5000
NODE_ENV=production
Frontend (.env)
env
REACT_APP_API_URL=https://tinylink-backend.onrender.com
🎯 Usage
Visit the frontend: Go to https://tinylink.vercel.app

Enter long URL: Paste your long URL in the input field

Optional custom code: Add a custom alias if desired

Generate short link: Click "Shorten URL" button

Copy and share: Use the generated short link anywhere

🤝 Contributing
We welcome contributions! Please follow these steps:

Fork the repository

Create a feature branch (git checkout -b feature/amazing-feature)

Commit your changes (git commit -m 'Add amazing feature')

Push to the branch (git push origin feature/amazing-feature)

Open a Pull Request

📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

👨‍💻 Author
Yash Wadkar

GitHub: @Yashwadkar2121

Project: Tinylink

🙏 Acknowledgments
React.js community

Express.js team

Neon.tech for PostgreSQL hosting

Render for backend hosting

Vercel for frontend hosting

text

This README.md includes:

1. **Project overview** with features
2. **Live demo links** (you'll need to update with your actual deployed URLs)
3. **Complete tech stack** information
4. **Installation instructions** for local development
5. **Database schema** and API documentation
6. **Deployment guides** for Render, Vercel, and Neon.tech
7. **Environment variable** configurations
8. **Usage instructions** for end users
9. **Contribution guidelines**
10. **Proper attribution** and acknowledgments

Make sure to:
- Update the live demo URLs once you deploy
- Replace the author information if needed
- Add any additional features specific to your implementation
- Include a LICENSE file if you choose a different license

The README is comprehensive and should help users understand, use, and contribute to your project effectively.