import AppProvider from "@/AppProvider";
import Suspense from "@/components/Suspense";
import React from "react";
import { createBrowserRouter } from "react-router-dom";
import mainRoutes from "./mainRoutes";

const MainLayout = React.lazy(() => import("@/layouts/MainLayout"));
const NotFoundPage = React.lazy(() => import("./NotFoundPage"));

const router = createBrowserRouter([
  {
    element: <AppProvider />,
    children: [
      {
        element: <Suspense><MainLayout /></Suspense>,
        children: [
          ...mainRoutes,
          {
            path: "*",
            element: <NotFoundPage />,
          },
        ],
      },
    ],
  },
]);

export default router;
