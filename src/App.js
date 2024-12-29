import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';
import Orders from './pages/Orders'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Provider store={store}>
          <Routes>
            <Route path="/" element={<Orders />} />
          </Routes>
        </Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
