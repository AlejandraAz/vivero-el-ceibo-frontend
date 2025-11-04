import { createContext, useState, useContext, useEffect } from "react";
import api from '../../src/Services/Api.js';
// import { useNavigate } from "react-router-dom";

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // const navigate = useNavigate();

  const checkAuth = async () => {

    try {
      const res = await api.get("/auth/protegida", {
      timeout: 5000,
      validateStatus: (status) => status < 500 // cualquier 4xx no rompe el catch
    }); // si hay cookie válida, devuelve el usuario

      // setUser(res.data.user || null);
      const userData = res.data.user;

      if (!userData) {
      // Invitado → no espera más
      setUser(null);
      return;
    }

      // if (userData) {
        //  Traigo perfil completo para tener photo, name, etc.
      //         let fullUser;
      // if (userData.rol === "cliente") {
      //   const profileRes = await api.get("/customer/profile");
      //   fullUser = { ...userData, ...profileRes.data.profile };
      // } else if (userData.rol === "admin") {
      //   const profileRes = await api.get("/admin/dashboard"); 
      //   fullUser = { ...userData, ...profileRes.data.profile };
      // }
      // setUser(fullUser);

      // } else {
      //   setUser(null);
      // }

      // if (userData.rol === "cliente") {
      //     try {
      //       const profileRes = await api.get("/customer/profile", { timeout: 5000 });
      //       setUser({ ...userData, ...profileRes.data.profile });
      //     } catch (err) {
      //       console.error("Error trayendo perfil cliente:", err);
      //       setUser(userData);
      //     }
      //   } else {
      //     // Admin: solo datos del token
      //     setUser(userData);
      //   }
      // } else {
      //   setUser(null);
      // }

      else if (userData.rol === "cliente") {
      try {
        const profileRes = await api.get("/customer/profile", { timeout: 3000 });
        setUser({ ...userData, ...profileRes.data.profile });
      } catch (err) {
        console.error("Error perfil cliente:", err);
        setUser(userData);
      }
    } else {
      // Admin
      setUser(userData);
    }

    } catch (error) {
      console.log('mensaje de error', error)
      setUser(null); // no logueado
    } finally {

      setLoading(false);
    }
  };

  const login = async (userData) => {
    // setUser(userData);
    try {
      // Traer perfil completo después de login
    //   const profileRes = await api.get("/customer/profile");
    //   const fullUser = { ...userData, ...profileRes.data.profile };
    //   setUser(fullUser);
    // } catch (error) {
    //   console.error("login error:", error);
    //   setUser(userData); // al menos guardamos datos básicos
    // }
     if (userData.rol === "cliente") {
        const profileRes = await api.get("/customer/profile");
        const fullUser = { ...userData, ...profileRes.data.profile };
        setUser(fullUser);
      } else {
        setUser(userData); // Admin
      }
    } catch (error) {
      console.error("login error:", error);
      setUser(userData);
    }
  };

  const logout = async () => {
    // await api.post('/auth/logout');
    // setUser(null);
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("logout error:", err);
    } finally {
      setUser(null);
    }
  }


  // Función para actualizar usuario desde cualquier componente
  const updateUser = (updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
  };
  useEffect(() => {
    checkAuth();
  }, []);
  return (
    <AuthContext.Provider value={{ user, setUser, updateUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
};

export const useAuth = () => useContext(AuthContext);

// a este componente lo utilizo luego en el App (lo envuelvo) para garantizarme que toda la app tenga acceso al contexto de autenticacionz
