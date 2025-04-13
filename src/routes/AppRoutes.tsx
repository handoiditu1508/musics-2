import Suspense from "@/components/Suspense";
import React from "react";
import { useTranslation } from "react-i18next";
import { Route, Routes } from "react-router-dom";
import MainRoute from "./MainRoute";

const SecondLayout = React.lazy(() => import("@/layouts/SecondLayout"));

export default function AppRoutes() {
  const { t } = useTranslation();

  return (
    <Routes>
      <Route element={<Suspense><SecondLayout /></Suspense>}>
        {MainRoute}
        <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <p>{t("There's nothing here!")}</p>
            </main>
          }
        />
      </Route>
    </Routes>
  );
}
