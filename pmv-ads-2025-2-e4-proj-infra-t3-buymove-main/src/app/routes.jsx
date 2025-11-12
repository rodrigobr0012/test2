import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import Home from "@/pages/Home";
import Catalog from "@/pages/Catalog";
/*import VehicleDetails from "@/pages/VehicleDetails";
import Profile from "@/pages/Profile";*/
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Favorites from "@/pages/Favorites";
import VehicleCreate from "@/pages/VehicleCreate";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "catalog", element: <Catalog /> },
      { path: "vehicle/new", element: <VehicleCreate /> },
      /*{ path: "vehicle/:id", element: <VehicleDetails /> },
      { path: "profile", element: <Profile /> },*/
      { path: "favorites", element: <Favorites /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
]);
