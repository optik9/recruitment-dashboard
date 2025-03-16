import React, { useState } from "react";
import { auth } from "../../firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboardBusiness");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-900">
      <form onSubmit={handleLogin} className="w-96 bg-white p-8 rounded-2xl shadow-xl transform transition-all hover:shadow-2xl">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img 
            src="./logo_chachibot_login.png"
            alt="ChachiBot" 
            className="w-32 h-32 object-contain"
          />
        </div>

        <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Acceder a su cuenta
        </h1>
        
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Correo Electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <button 
          type="submit" 
          className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md"
        >
          Continuar
        </button>

        {/* Enlaces inferiores */}
        <div className="mt-6 flex flex-col gap-2 text-center">
          <a 
            onClick={() => navigate("/register")}
            className="text-blue-600 hover:text-purple-700 cursor-pointer text-sm font-medium transition-colors"
          >
            ¿No tiene cuenta? <span className="font-semibold">Regístrese</span>
          </a>
          <a 
            onClick={() => navigate("/")}
            className="text-blue-600 hover:text-purple-700 cursor-pointer text-sm font-medium transition-colors"
          >
            ← Volver a la página principal
          </a>
        </div>
      </form>
    </div>
  );
};

export default Login;