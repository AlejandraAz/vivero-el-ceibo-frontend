import { useState } from "react";

export default function ShippingForm({ setShippingData, goToSummary, goBack }) {
  const [form, setForm] = useState({
    name: "",
    street: "",
    number: "",
    city: "",
    postalCode: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});

  // Validación simple
  const validate = () => {
    const newErrors = {};
    Object.keys(form).forEach((key) => {
      if (!form[key].trim()) {
        newErrors[key] = "Este campo es obligatorio";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setShippingData(form); // guardamos los datos
      goToSummary(); // pasamos al resumen
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4" style={{ color: "#3A6B35" }}>
        Formulario de Envío
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {[
          { label: "Nombre completo", name: "name" },
          { label: "Calle", name: "street" },
          { label: "Número", name: "number" },
          { label: "Localidad", name: "city" },
          { label: "Código Postal", name: "postalCode" },
          { label: "Teléfono", name: "phone" },
        ].map((field) => (
          <div key={field.name} className="flex flex-col">
            <label className="mb-1 font-semibold">{field.label}</label>
            <input
              type="text"
              name={field.name}
              value={form[field.name]}
              onChange={handleChange}
              className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#B08968]"
            />
            {errors[field.name] && (
              <span className="text-red-500 text-sm mt-1">{errors[field.name]}</span>
            )}
          </div>
        ))}
        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={goBack}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Volver
          </button>
          <button
            type="submit"
            className="bg-[#B08968] text-white px-4 py-2 rounded hover:bg-[#A3785C]"
          >
            Continuar
          </button>
        </div>
      </form>
    </div>
  );
}
