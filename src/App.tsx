import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import Home, { homeLoader } from 'pages/home'
import Community, { communityLoader } from 'pages/community';

import Layout from 'components/Layout';
import NotFound from 'components/NotFound';

import './App.css';

function App() {
  const { i18n } = useTranslation()
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <NotFound />,
      children: [
        {
          index: true,
          element: <Home />,
          loader: homeLoader,
        },
        {
          path: "community/:slug",
          element: <Community />,
          loader: communityLoader,
        },
      ],
    },
  ]);

  return (
    <RouterProvider router={router} fallbackElement={<NotFound />} />
  );
}

export default App;
