import React from 'react';
import { Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import { ProfileProvider } from './context/profile.context';
import HomePage from './pages/HomePage';
import SignInPage from './pages/SignInPage';

function App() {
  return (
    <ProfileProvider>
      <BrowserRouter>
        <Switch>
          <PublicRoute path="/signin">
            <SignInPage />
          </PublicRoute>
          <PrivateRoute path="/">
            <HomePage />
          </PrivateRoute>
        </Switch>
      </BrowserRouter>
    </ProfileProvider>
  );
}

export default App;
