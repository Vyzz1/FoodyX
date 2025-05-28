import Footer from "@/components/shared/footer";
import Header from "@/components/shared/header";
import { Outlet } from "react-router-dom";

const LayoutDefault = () => {
  return (
    <div className="antialiased">
      <Header />

      <main className="min-h-screen ">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default LayoutDefault;
