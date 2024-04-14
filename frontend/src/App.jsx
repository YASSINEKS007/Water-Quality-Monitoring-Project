import React from "react";
import Chart from "chart.js/auto";
import MainLayout from "./layouts/MainLayout";
import DashBoardPage from "./pages/DashBoardPage";
import MeasurementsPage from "./pages/MeasurementsPage";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";


const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout />}>
        <Route index element={<DashBoardPage />} />
        <Route path="/measurements" element={<MeasurementsPage />}/>
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
