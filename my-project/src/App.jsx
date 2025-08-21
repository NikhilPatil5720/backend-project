import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Upload from "./pages/Upload";   // ✅ Add this
import Explore from "./pages/Explore"; // ✅ Add this
import VideoPlayer from "./pages/VideoPlayer";
import MyVideos from "./pages/MyVideos";
import EditVideo from "./pages/EditVideo";


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/explore" element={<Explore />} />
  <Route path="/videos/:videoId" element={<VideoPlayer />} />  {/* new route */}
<Route path="/my-videos" element={<MyVideos />} />
<Route path="/edit-video/:videoId" element={<EditVideo />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
