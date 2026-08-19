import { RouterProvider } from "react-router";
import { router } from "./router";
import { ModalRoot } from "../components/common/ModalRoot";
import { Toaster } from "../components/common/Toaster";

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ModalRoot />
      <Toaster />
    </>
  );
}
