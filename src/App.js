import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import Orders from './pages/Orders';
import Machines from './pages/Machines';
import Customers from './pages/Customers';
import Inventory from './pages/Inventory';
import Products from './pages/Products';

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <BrowserRouter>
          
            <Routes>
              <Route path="/" element={<Orders />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/machines" element={<Machines />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/products" element={<Products />} />
            </Routes>
          
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
