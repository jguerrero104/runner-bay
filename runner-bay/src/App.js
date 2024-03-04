import './App.css';
import Button from 'react-bootstrap/Button';
import "bootstrap/dist/css/bootstrap.min.css";
import Layout from './Layout';
function App() {
  return (
    <Layout>
    <div className="App">
      <header className="App-header">
        <Button> This is button </Button>
      </header>
    </div>
    </Layout>
  );
}

export default App;
