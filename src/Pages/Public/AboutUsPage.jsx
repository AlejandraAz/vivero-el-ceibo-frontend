import React from "react";
import { Link } from "react-router-dom";
import paisajismo from "../../assets/ImgsTarjetas/paisajismo.jpg";
import historiaVivero from "../../assets/ImgsSobreNosotros/historiaVivero.jpg"
import instalacionVivero1 from "../../assets/ImgsSobreNosotros/instalacionesVivero.jpg";
import instalacionVivero2 from "../../assets/ImgsSobreNosotros/instalacionesVivero2.jpg";
import instalacionVivero3 from "../../assets/ImgsSobreNosotros/instalacionesVivero3.jpg";
import raquelPerez from "../../assets/ImgsSobreNosotros/raquelGomez.jpg";
import carlosGomez from "../../assets/ImgsSobreNosotros/carlosGomez.jpg";
import mariaLopez from "../../assets/ImgsSobreNosotros/mariaLopez.jpg";
import { Leaf, Recycle, Sun, TreeDeciduous, ArrowRight } from 'lucide-react';


// Ejemplo de datos del equipo
const teamMembers = [
  { name: "Raquel Perez", role: "Fundador", image: raquelPerez },
  { name: "María López", role: "Encargada de cultivo", image: mariaLopez },
  { name: "Carlos Gómez", role: "Atención al cliente", image: carlosGomez },
];



const values = [
  { icon: <Leaf size={48} />, title: "Plantas de calidad" },
  { icon: <Recycle size={48} />, title: "Sustentabilidad" },
  { icon: <Sun size={48} />, title: "Atención personalizada" },
  { icon: <TreeDeciduous size={48} />, title: "Promoción de biodiversidad" },
];
// Galería de instalaciones
const gallery = [
  instalacionVivero1,
  instalacionVivero2,
  instalacionVivero3
];

const AboutUsPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-16">
      
      {/* Hero Section */}
      <section className="relative h-64 md:h-96 rounded-lg overflow-hidden">
        <img
          src={paisajismo}
          alt="Vivero El Ceibo"
          className="w-full h-full object-cover"
        />
         <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-center items-center text-center text-white px-6 py-10">
        {/* <div className="absolute inset-0 bg-green-700 z-10 bg-opacity-30 flex flex-col justify-center items-center text-center text-white px-4"> */}
          <h1 className="text-3xl md:text-5xl font-bold mb-2">Bienvenidos a El Ceibo</h1>
          <p className="text-lg md:text-2xl">Amamos la naturaleza y queremos que lleves un pedacito de ella a tu hogar</p>
        </div>
      </section>

      {/* Historia */}
      <section className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-4 text-green-900">Nuestra Historia</h2>
          <p className="text-gray-700 mb-2">
            El Ceibo nació hace más de 15 años con el objetivo de acercar la naturaleza a cada hogar.
            Cultivamos con amor y cuidado, ofreciendo plantas y flores de alta calidad.
          </p>
          <p className="text-gray-700">
            Nuestro compromiso es con la sostenibilidad, la biodiversidad y la satisfacción de nuestros clientes.
          </p>
        </div>
        <div>
          <img
            src={historiaVivero}
            alt="Vivero El Ceibo"
            className="w-full h-64 md:h-80 object-cover rounded-lg shadow-md"
          />
        </div>
      </section>

      {/* Equipo */}
      <section>
        <h2 className="text-3xl font-bold mb-6 text-center text-green-900 py-5">Conoce a nuestro equipo</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {teamMembers.map((member) => (
            <div key={member.name} className="bg-[#B08968] rounded-lg shadow-md overflow-hidden text-center p-4">
              <img
                src={member.image}
                alt={member.name}
                className="w-32 h-32 mx-auto rounded-full object-cover mb-4"
              />
              <h3 className="font-bold text-amber-950 text-lg">{member.name}</h3>
              <p className="text-gray-800">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Valores */}
      <section>
        <h2 className="text-3xl font-bold mb-6 text-center">Nuestros Valores</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {values.map((value) => (
            <div key={value.title} className="bg-green-100 rounded-lg p-6 flex flex-col items-center justify-center shadow-sm">
              <span className="text-4xl mb-2 text-green-900">{value.icon}</span>
              <p className="font-semibold text-green-900">{value.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Galería del vivero */}
      <section>
        <h2 className="text-3xl font-bold mb-6 text-center">Nuestro Vivero</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {gallery.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Vivero ${index + 1}`}
              className="w-full h-64 md:h-72 object-cover rounded-lg shadow-md"
            />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-12 bg-green-600 rounded-lg text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Explora nuestra colección de plantas</h2>
        <p className="mb-6">Visita nuestra tienda online y lleva la naturaleza a tu hogar</p>
        <Link
          to="/catalog"
          className="bg-white text-green-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition inline-flex items-center justify-center"
        >
          Comprar ahora
          <ArrowRight size={16} className="ml-4" />
        </Link>
      </section>

    </div>
  );
};

export default AboutUsPage;
