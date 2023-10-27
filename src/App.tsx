import React from "react"
import { RouterProvider, createBrowserRouter } from "react-router-dom"

import Home, { homeLoader } from "pages/home"
import Community, { communityLoader } from "pages/community"

import Layout from "components/Layout"
import Loading from "components/Loading"
import NotFound from "components/NotFound"

import "./App.css"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,
    // note(LM): Don't revalidate on parent "index" route
    // Without this, the "/" path & "index: true" child
    // will both revalidate on any change resulting in multiple
    // calls to the API (aka: when search params are changed)
    shouldRevalidate: () => false,
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
])

function App() {
  return (
    <RouterProvider router={router} fallbackElement={<Loading />} />
  )
}

export default App
