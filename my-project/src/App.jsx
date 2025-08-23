import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
import Navbar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Upload from "./pages/Upload";
import Explore from "./pages/Explore";
import MyVideos from "./pages/MyVideos";
import EditVideo from "./pages/EditVideo";
import MySubscriptions from "./pages/MySubscriptions";
import TweetPage from "./pages/TweetPage";
import FeedPage from "./pages/TweetFeedPage";
import DashboardPage from "./pages/DashboardPage";
import HealthCheckPage from "./pages/Healthcheck";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/tweets" element={<TweetPage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/healthcheck" element={<HealthCheckPage />} />


        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-videos"
          element={
            <ProtectedRoute>
              <MyVideos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-video/:videoId"
          element={
            <ProtectedRoute>
              <EditVideo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-subscriptions"
          element={
            <ProtectedRoute>
              <MySubscriptions />
            </ProtectedRoute>
          }
        />
        <Route path="/dashboard/:channelId" element={<DashboardWrapper />} />
        <Route path="/dashboard" element={<DashboardWrapper />} />
      </Routes>
    </Router>
  );
}

// Wrapper to pass channelId param if available
const DashboardWrapper = () => {
  const { channelId } = useParams();
  return (
    <ProtectedRoute>
      <DashboardPage channelId={channelId} />
    </ProtectedRoute>
  );
};

export default App;
