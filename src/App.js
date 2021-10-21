import React from 'react';
import './App.css';
import { ProfileProvider } from './context/profile.context';
import { Routes } from './Routes';

function App() {
  // Routing the paths for this project
  return (
    <ProfileProvider>
      <Routes />
    </ProfileProvider>
  );
}

export default App;
