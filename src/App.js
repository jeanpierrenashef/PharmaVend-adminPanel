import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import Orders from './pages/Orders';
import Machines from './pages/Machines';

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <BrowserRouter>
          
            <Routes>
              <Route path="/" element={<Orders />} />
              <Route path="/machines" element={<Machines />} />
            </Routes>
          
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
