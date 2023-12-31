import { Route, Routes, BrowserRouter } from "react-router-dom";
import Main from "../Main/Main";
import AppStateProvider from "../../context/AppStateProvider";
import NewCustomer from "../../components/Customer/NewCustomer/NewCustomer";
import UpdateCustomer from "../../components/Customer/UpdateCustomer/UpdateCustomer";
import ErrorBoundary from "../../errorboundary/ErrorBoundary";

function App() {
  return (
    <div className="container mt-5">
      {/* Application title */}
      <div className="p-2">
        <h1>Crudio!</h1>
      </div>
      <ErrorBoundary>
        {/* Provide the application state */}
        <AppStateProvider>
          {/* Set up the browser router */}
          <BrowserRouter>
            {/* Define the routes */}
            <Routes>
              {/* Define a route for the main component */}
              <Route exact path="/" element={<Main />} />
              <Route exact path="/new-customer" element={<NewCustomer />} />
              <Route exact path="/update-customer" element={<UpdateCustomer />} />
            </Routes>
          </BrowserRouter>
        </AppStateProvider>
      </ErrorBoundary>
    </div>
  );
}

export default App;
