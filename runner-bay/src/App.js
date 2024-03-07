import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import Layout from './Layout';
import Listings from './Listings';
import News from './News';
import About from './About';
import Home from './Home';


function App() {
  return (
    <Router> 
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="listings" element={<Listings />} />
          <Route path="news" element={<News />} />
          <Route path="about" element={<About />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
