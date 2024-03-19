import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import Layout from './Layout';
import Listings from './Listings';
import News from './News';
import About from './About'
import LostAndFound from './LostAndFound';
import Home from './Home';
import Profile from './Profile';
import Settings from './Settings';
import Login from './Login';
import Register from './Register';
import { AuthProvider } from './AuthContext';


function App() {
  return (
    <AuthProvider>
    <Router> 
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="listings" element={<Listings />} />
          <Route path="news" element={<News />} />
          <Route path="about" element={<About />} />
          <Route path="lostandfound" element={<LostAndFound />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path ="login" element={<Login />} />
          <Route path ="register" element={<Register />} />
        </Routes>
      </Layout>
    </Router>
    </AuthProvider>
  );
}

export default App;
