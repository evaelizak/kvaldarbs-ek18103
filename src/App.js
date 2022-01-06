import React from 'react';
import './App.css';
import { ProfileProvider } from './context/profile.context';
import { Routes } from './Routes';

function App() {
  return (
    // profile context
    <ProfileProvider>
      {/* routing */}
      <Routes />
    </ProfileProvider>
  );
}

export default App;
