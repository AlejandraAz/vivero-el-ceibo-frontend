import { React, useState } from 'react'
import FormLogin from '../../Components/FormLogin.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../Services/Api.js';
import { useNavigate } from 'react-router-dom';



const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState('');


  const handleLogin = async () => {
    try {
      const response = await api.post("/auth/login", { email, password });
      login(response.data.user);
      // console.log("Login:", response.data);
      // console.log(response.data.user.rol)

      await new Promise(resolve => setTimeout(resolve, 550));
      
      if (response.data.user.rol === "admin") {
        navigate("/admin/dashboard");
      } else { navigate("/") };
    } catch (error) {
      // if (error?.response?.status === 403) {
      //   setErrorMessage("Tu cuenta está bloqueada. Contacta con el administrador.");
      // navigate("/unauthorized"); 
      if (error?.response?.status === 401) {
      setErrorMessage("No estás autenticado o el token ha expirado.");
      navigate("/login");
    } else if (error?.response?.status === 403) {
      setErrorMessage("No tienes permisos para acceder a esta página.");
      navigate("/unauthorized");
      } else {
        alert("Credenciales inválidas"); // o mostrar el error real
      }
    }
  }

  // google
  const handleGoogleLogin = async (credentialResponse) => {
  try {
    // credentialResponse.credential es el JWT de Google
    const response = await api.post("/auth/google", {
      credential: credentialResponse.credential,
    });

    login(response.data.user);

    // Redirigir según rol
    if (response.data.user.rol === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/");
    }
  } catch (error) {
    console.error("Error Google Login:", error);
    alert("Error al iniciar sesión con Google");
  }
};
  return (
    <>
      <FormLogin
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        handleLogin={handleLogin}
        handleGoogleLogin={handleGoogleLogin}/>
    </>
  )
}

export default LoginPage;
