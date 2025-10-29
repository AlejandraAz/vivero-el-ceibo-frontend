import { Link, Outlet } from "react-router-dom";
import { LogOut, ShoppingCart, User, ClipboardList } from "lucide-react";
import NavBar from "../Components/NavBar.jsx";
import Footer from "../Components/Footer.jsx";

const CustomerLayout = () => {
    return (
        
        <div className="flex flex-col min-h-screen bg-green-50">
            <NavBar />
            <main className="flex-1 p-6">
                <Outlet />
            </main>
            <Footer/>
        </div>
        
    );
};

export default CustomerLayout;
