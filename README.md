# InsightXL - AI-Powered Excel Data Analysis & Visualization

InsightXL is a full-stack web application that leverages AI to simplify Excel data processing, analysis, and visualization through natural language commands.

## 🌟 Features

- **Chat With Excel**: Upload and interact with Excel files using natural language
- **Image to Excel**: Convert table images (JPG, PNG) to editable Excel spreadsheets
- **PDF to Excel**: Extract tables from PDF documents
- **Excel to Dashboard**: Transform Excel data into visual dashboards
- **AI-Powered Analysis**: Powered by OpenAI GPT-4o for intelligent data insights
- **User Authentication**: Secure user registration and login with Supabase
- **Theme Support**: Beautiful day/night theme with persistent preferences

## 🏗️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Vite** for fast development
- **Supabase Client** for authentication
- **Theme System** with localStorage persistence

### Backend
- **FastAPI** (Python) for high-performance API
- **OpenAI GPT-4o** for AI capabilities
- **Supabase** for database and authentication
- **Pandas & NumPy** for data processing

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.10 or higher)
- **Supabase Account** (https://supabase.com)
- **OpenAI API Key** (https://platform.openai.com)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Utsavrawar27/InsightXL.git
cd InsightXL
```

### 2. Set Up Supabase

1. Go to [Supabase](https://supabase.com) and create a new project
2. Go to **Project Settings > API** and copy:
   - Project URL
   - anon/public key
   - service_role key
3. Go to **SQL Editor** and run the database schema from `ENV_SETUP.md`

### 3. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# On Windows:
.\.venv\Scripts\activate
# On Mac/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
# Copy the template from ENV_SETUP.md and add your credentials
```

**backend/.env file:**
```env
OPENAI_API_KEY=your_openai_api_key_here
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
```

**Run the backend:**
```bash
uvicorn main:app --reload --port 8000
```

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
# Copy the template from ENV_SETUP.md and add your credentials
```

**frontend/.env file:**
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Run the frontend:**
```bash
npm run dev
```

The application will be available at http://localhost:5173

## 📚 API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Key Endpoints

#### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/signin` - Sign in user
- `POST /auth/signout` - Sign out user
- `GET /auth/user` - Get current user

#### Chat/Analysis
- `POST /chat` - Send message to AI agent
- `GET /health` - Health check

## 🗄️ Database Schema

The application uses Supabase PostgreSQL with the following schema:

### user_profiles table
```sql
- id (UUID, Primary Key) - References auth.users
- email (TEXT, UNIQUE)
- name (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

Row Level Security (RLS) is enabled to ensure users can only access their own data.

## 🎨 Features in Detail

### Authentication
- Email/Password registration and login
- Google OAuth integration (optional)
- Secure session management
- Password validation
- Email verification

### Theme System
- Light/Dark theme toggle
- Persistent theme preference (localStorage)
- Consistent styling across all pages
- Optimized for readability in both themes

### Excel AI Agent
- Natural language queries
- Data cleaning and transformation
- Statistical analysis
- Chart generation
- Intelligent recommendations

## 🔒 Security

- Environment variables for sensitive data
- Row Level Security (RLS) in Supabase
- JWT-based authentication
- CORS configuration
- Input validation
- SQL injection prevention

## 🛠️ Development

### Project Structure

```
InsightXL/
├── backend/
│   ├── config/
│   │   └── supabase.py
│   ├── models/
│   │   └── schemas.py
│   ├── routers/
│   │   ├── auth.py
│   │   └── chat.py
│   ├── services/
│   │   └── llm.py
│   └── main.py
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── lib/
│   │   └── App.tsx
│   └── package.json
└── README.md
```

### Running Tests

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

## 📝 Environment Variables Reference

See `ENV_SETUP.md` for detailed environment variable setup instructions.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- **Utsav Rawar** - [GitHub](https://github.com/Utsavrawar27)

## 🙏 Acknowledgments

- OpenAI for GPT-4o API
- Supabase for backend infrastructure
- Tailwind CSS for styling system
- FastAPI for backend framework
- React team for the frontend framework

## 📞 Support

For support, email support@insightxl.com or open an issue in the GitHub repository.

---

Made with ❤️ by Utsav Rawar
