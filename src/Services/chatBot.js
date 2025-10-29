import api from "./Api.js";

const chatService = async(pregunta)=>{

    try {
    const { data } = await api.post("/chatbot/query", { pregunta });
    return data.respuesta; 
  } catch (error) {
    console.error("Error en chatService:", error);
    throw error;
  }
}
export default chatService;