import './App.css';
import './components/Login.jsx';
import { BrowserRouter as Router } from 'react-router-dom';
import { Auth } from './components/ProtectedRoutes';
import AuthApp from './AuthApp';
import NotAuthApp from './NotAuthApp';

function App() {
  const isAuth = Auth();
  return (
      <Router>
        {isAuth ? AuthApp() : NotAuthApp()}
      </Router>
  );
}

export default App;
