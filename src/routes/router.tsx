import AppProvider from "@/AppProvider";
import Suspense from "@/components/Suspense";
import React from "react";
import { createHashRouter } from "react-router-dom";
import mainRoutes from "./mainRoutes";

const SecondLayout = React.lazy(() => import("@/layouts/SecondLayout"));
const NotFoundPage = React.lazy(() => import("./NotFoundPage"));

const router = createHashRouter([
  {
    element: <AppProvider />,
    children: [
      {
        element: <Suspense><SecondLayout /></Suspense>,
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
