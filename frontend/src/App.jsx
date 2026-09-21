import { RouterProvider } from "react-router";
import router from "./routes/Routes";
import FacebookInit from "./components/common/FacebookInit";

function App() {
  return (
    <>
      <FacebookInit />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
