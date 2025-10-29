import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ContactPage = () => {
  const form = useRef();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      const dateStr = new Date().toLocaleString("es-AR");
      if (form.current) {
        const dateInput = form.current.querySelector('input[name="date"]');
        if (dateInput) dateInput.value = dateStr;
      }

      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        form.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      setSent(true);
      toast.success("Mensaje enviado correctamente 🌿");
      form.current.reset();
      setTimeout(() => setSent(false), 4000);
    } catch (err) {
      console.error("Error al enviar mensaje:", err);
      toast.error("No se pudo enviar el mensaje. Revisá tu configuración de EmailJS.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto my-12 px-6">
      <h1 className="text-3xl font-bold text-center text-green-800 mb-2">Contáctanos</h1>
      <p className="text-center text-gray-700 mb-8">
        Completá el formulario o visitanos en Ruta Nac. 36 y Laguna Blanca, Río Cuarto (X5800).
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* FORMULARIO */}
        <form
          ref={form}
          onSubmit={handleSubmit}
          className="bg-[#FBF9F6] p-6 rounded-lg shadow-md border border-green-100"
        >
          <div className="mb-4">
            <label className="block text-sm font-semibold text-green-900 mb-1">Nombre completo</label>
            <input
              name="name"
              type="text"
              required
              placeholder="Tu nombre"
              className="w-full border border-green-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-green-900 mb-1">Correo electrónico</label>
            <input
              name="email"
              type="email"
              required
              placeholder="tuemail@ejemplo.com"
              className="w-full border border-green-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-green-900 mb-1">Asunto</label>
            <input
              name="subject"
              type="text"
              placeholder="Contacto"
              className="w-full border border-green-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <input type="hidden" name="date" />

          <div className="mb-4">
            <label className="block text-sm font-semibold text-green-900 mb-1">Mensaje</label>
            <textarea
              name="message"
              rows="4"
              required
              placeholder="Escribí tu mensaje..."
              className="w-full border border-green-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={sending}
            className={`w-full flex items-center justify-center gap-3 py-2 rounded-lg text-white font-semibold transition ${
              sending ? "bg-green-400 cursor-not-allowed" : "bg-green-700 hover:bg-green-800"
            }`}
          >
            {sending ? (
              <>
                <span>Enviando...</span>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              </>
            ) : (
              "Enviar mensaje"
            )}
          </button>

          {/* {sent && <p className="text-center text-green-800 mt-3 font-semibold">✅ Mensaje enviado</p>} */}
        </form>

        {/* GOOGLE MAPS */}
        <div className="rounded overflow-hidden shadow-md border border-green-100">
          <iframe
            title="Ubicación Vivero El Ceibo"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3363.138956521965!2d-64.5557!3d-31.98643!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95b4a6d1f7794d4f%3A0x9bfb46f9492b2a13!2sVivero%20El%20Ceibo!5e0!3m2!1ses-419!2sar!4v1705628400000!5m2!1ses-419!2sar"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            className="rounded-2xl"
          ></iframe>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={2500} hideProgressBar />
    </div>
  );
};

export default ContactPage;
