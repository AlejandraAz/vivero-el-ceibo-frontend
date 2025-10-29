import api from "./Api.js";

//para interactuar con el back
const getMyCart = () => api.get("/cart/my-items");
const createCart = (data) => api.post("/cart", data);
const addCartItem = (data) => api.post("/cart-item", data);
const updateCartItem = (itemId, data) => api.put(`/cart-item/${itemId}`, data);
const deleteCartItem = (itemId) => api.delete(`/cart-item/${itemId}`);

export {getMyCart,createCart,addCartItem,updateCartItem,deleteCartItem}