# EvolveMeApp - Personal Growth & Habit Tracking Application

A full-stack mobile application built with React Native (Expo) and Node.js/Express, designed to help users track their personal goals, build positive habits, and maintain a daily journal for self-improvement.

## 🚀 Features

- **User Authentication**: Secure login and registration system
- **Goal Management**: Create, track, and complete personal goals
- **Habit Tracking**: Build and monitor daily habits with streak tracking
- **Journal Entries**: Daily mood and reflection tracking
- **Dashboard**: Overview of progress and achievements
- **Responsive Design**: Works on both iOS and Android

## 🛠 Tech Stack

### Frontend
- **React Native** with Expo
- **React Navigation** for navigation
- **Axios** for API communication
- **AsyncStorage** for local data persistence
- **Context API** for state management

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests

## 📱 Screenshots

*Screenshots will be added here*

## 🏗 Project Structure

```
EvolveMeApp/
├── frontend/                 # React Native Expo app
│   ├── api/                 # API client configuration
│   ├── components/          # Reusable UI components
│   ├── context/            # React Context providers
│   ├── navigation/         # Navigation configuration
│   ├── screens/            # App screens
│   └── assets/             # Images, fonts, etc.
├── backend/                # Node.js Express server
│   ├── config/            # Database and app configuration
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/           # MongoDB schemas
│   └── routes/           # API routes
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- Expo CLI (`npm install -g expo-cli`)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd EvolveMeApp
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Create environment variables**
   Create a `.env` file in the backend directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

4. **Start the backend server**
   ```bash
   npm run dev
   ```

5. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

6. **Update API URL**
   In `frontend/api/client.js`, update the `API_URL` to match your backend server IP address.

7. **Start the frontend**
   ```bash
   npm start
   ```

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth` - Get logged-in user (protected)

### Goals
- `GET /api/goals` - Get user goals (protected)
- `POST /api/goals` - Create new goal (protected)
- `PUT /api/goals/:id` - Update goal (protected)
- `DELETE /api/goals/:id` - Delete goal (protected)

### Habits
- `GET /api/habits` - Get user habits (protected)
- `POST /api/habits` - Create new habit (protected)
- `PUT /api/habits/:id` - Update habit (protected)
- `DELETE /api/habits/:id` - Delete habit (protected)
- `POST /api/habits/:id/complete` - Mark habit as completed (protected)

### Journal
- `GET /api/journal` - Get user journal entries (protected)
- `POST /api/journal` - Create new journal entry (protected)
- `PUT /api/journal/:id` - Update journal entry (protected)
- `DELETE /api/journal/:id` - Delete journal entry (protected)

## 🔧 Development

### Running in Development Mode
```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm start
```

### Building for Production
```bash
# Frontend
cd frontend
expo build:android  # or expo build:ios
```

## 📝 Environment Variables

### Backend (.env)
```env
MONGO_URI=mongodb://localhost:27017/evolveme
JWT_SECRET=your_super_secret_jwt_key
PORT=5000
NODE_ENV=development
```

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)

## 🙏 Acknowledgments

- React Native community
- Expo team for the amazing development tools
- MongoDB for the database solution
- All contributors and supporters

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact the development team.

---

**Made with ❤️ for personal growth and development** 