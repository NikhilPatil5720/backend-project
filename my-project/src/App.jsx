// apply blue gradient background to entire app
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
import CommentSection from "./components/VideoPage";
import PlaylistsPage from "./pages/PlaylistsPage";
import PlaylistDetail from "./pages/PlaylistDetail";
import ResetPassword from "./pages/ResetPassword";
import SearchResults from "./components/SearchResult";

function App() {
  const user = JSON.parse(localStorage.getItem("user")); // 👈 logged in user

  return (
    <Router>
      {/* Global Wrapper for background */}
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300">
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/tweets" element={<TweetPage />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/healthcheck" element={<HealthCheckPage />} />
          <Route path="/videos/:videoId" element={<CommentSection />} />

          <Route path="/playlists/:userId" element={<PlaylistsPage />} />
          <Route path="/playlist/:playlistId" element={<PlaylistDetail />} />
          <Route path="/my-playlist" element={<PlaylistsPage />} />
          <Route path="/forgot-password" element={<ResetPassword />} />
          <Route path="/search" element={<SearchResults />} />


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
      </div>
    </Router>
  );
}

// Wrapper for dashboard param
const DashboardWrapper = () => {
  const { channelId } = useParams();
  return (
    <ProtectedRoute>
      <DashboardPage channelId={channelId} />
    </ProtectedRoute>
  );
};

export default App;
