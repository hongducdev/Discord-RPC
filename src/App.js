import { Suspense, lazy, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import { paths } from "./utils/paths";
import Loading from "./components/Loading/Loading";
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Settings = lazy(() => import("./pages/Setting"));

const App = () => {
  
  return (
    <div className="dark:ctp-mocha md:overflow-x-hidden">
      <Suspense
        fallback={
          <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-ctp-base to-ctp-crust">
            <Loading />
          </div>
        }
      >
        <Routes>
          <Route element={<MainLayout />}>
            <Route path={paths.HOME} element={<Home />} />
            <Route path={paths.ABOUT} element={<About />} />
            <Route path={paths.SETTINGS} element={<Settings />} />
          </Route>
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;
