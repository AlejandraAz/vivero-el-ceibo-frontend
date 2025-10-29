
import { useCart } from "../../context/CartContext.jsx";
import CartItem from "./CartItem.jsx";


function CartPage() {

    const { cart, loading, updateItem, removeItem } = useCart();

     if (loading || !cart) return <p>Cargando carrito...</p>;
    // console.log('Items del carrito:', cart.items);



    return (
        <div className="max-w-xl mx-auto p-4">
            <h2 className="text-xl font-bold mb-4">Mi Carrito</h2>

            {cart.items.length === 0 ? (
                <p>Tu carrito está vacío.</p>
            ) : (
                cart.items.map(item => (
                    <CartItem
                        key={item.id}
                        item={item}
                        onUpdate={updateItem}  // función del contexto
                        onDelete={removeItem}  // función del contexto
                    />
                ))
            )}

            <h3 className="text-lg font-bold mt-4">Total: ${cart.total.toFixed(2)}</h3>
        </div>
    );
}

export default CartPage;
