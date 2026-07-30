import HomeIcon from "@mui/icons-material/Home";
import React from "react";
import { Outlet, RouteObject } from "react-router-dom";
import { RouteHandleObject } from "./models";

const HomePage = React.lazy(() => import("@/modules/main/pages/HomePage"));

const mainRoutes: RouteObject[] = [
  {
    element: <Outlet />,
    handle: {
      crumb: {
        to: "/",
        icon: <HomeIcon />,
      },
    } as RouteHandleObject,
    children: [
      {
        index: true,
        element: <HomePage />,
        handle: {
          hideBreadcrumbs: true,
        } as RouteHandleObject,
      },
      // example of breadcrumb configuration for user detail page
      // {
      //   path: "users/:userId",
      //   element: <UserDetailPage />,
      //   loader: async (args) => ({
      //     userId: args.params.userId,
      //   }),
      //   handle: {
      //     crumb: (data) => ({
      //       to: `users/${data.userId}`,
      //       icon: <HomeIcon />,
      //     }),
      //   } as RouteHandleObject,
      // },
    ],
  },
];

export default mainRoutes;
