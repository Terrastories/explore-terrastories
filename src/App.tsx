import React from 'react';
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Home from 'pages/home';
import Community from 'pages/community';

import Layout from 'components/Layout';
import NotFound from 'components/NotFound';

import './App.css';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <NotFound />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/community/:slug",
          element: <Community />,
        },
      ],
    },
  ]);

  return (
    <RouterProvider router={router} fallbackElement={<NotFound />} />
  );
}

export default App;
