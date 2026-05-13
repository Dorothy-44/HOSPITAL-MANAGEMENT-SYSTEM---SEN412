import React from 'react';
import { AppProviders } from './app/providers';
import { AppRouter } from './app/router';


/**
 * Root Application Component
 * 
 * This is the entry point for the React application.
 * It composes providers and routing together.
 */
const App: React.FC = () => {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
};

export default App;