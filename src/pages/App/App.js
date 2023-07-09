import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Main from "../Main/Main";
import AppStateProvider from "../../context/AppStateProvider";

function App() {
  return (
    <div className="container mt-5">
      {/* Application title */}
      <div className="p-2">
        <h1>Crudio!</h1>
      </div>
      
      {/* Provide the application state */}
      <AppStateProvider>
        {/* Set up the browser router */}
        <BrowserRouter>
          {/* Define the routes */}
          <Routes>
            {/* Define a route for the main component */}
            <Route exact path="/" element={<Main />} />
          </Routes>
        </BrowserRouter>
      </AppStateProvider>
    </div>
  );
}

export default App;
