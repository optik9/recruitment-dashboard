import React from 'react';
import { createRoot } from 'react-dom/client';
import MainRouter from './router/RouterProvider';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <MainRouter />
  </React.StrictMode>
);