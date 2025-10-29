import NavBar from "../Components/NavBar.jsx";
import Footer from "../Components/Footer.jsx";
import { Outlet } from "react-router-dom";

function Layouts() {
  return (
    <>
      <NavBar />
      <main className="min-h-screen">
        {/* El outlet es para representar contenido dinamico de acuerdo a la url,me permite mostrar el nav y footer en todads las secciones */}
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
export default Layouts;
