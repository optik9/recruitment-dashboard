import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from '../App';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  }
]);

export default function MainRouter() {
  return <RouterProvider router={router} />;
}