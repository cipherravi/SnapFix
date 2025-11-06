import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import "leaflet/dist/leaflet.css";
import router from "./router/index";
import Providers from "./utils/context/Providers";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <Providers>
    <RouterProvider router={router} />
  </Providers>
  // </StrictMode>
);
