function CartItem({ item, onUpdate, onDelete }) {
  return (
    <div className="flex justify-between items-center p-2 border-b">
      {/* Nombre del producto */}
      <div>{item.Product?.name}</div>

      {/* Input para cantidad */}
      <div>
        <input
          type="number"
          value={item.quantity}
          min="1"
          onChange={(e) => onUpdate(item.id, Number(e.target.value))}
          className="w-16 border rounded p-1"
        />
      </div>

      {/* Subtotal (lo manda el backend) */}
      <div>${item.subtotal}</div>

      {/* Botón eliminar */}
      <button
        onClick={() => onDelete(item.id)}
        className="bg-red-500 text-white px-2 py-1 rounded"
      >
        Eliminar
      </button>
    </div>
  );
}

export default CartItem;
