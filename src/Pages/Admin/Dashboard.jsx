import ProductStockChart from './Products/ProductStockChart.jsx';
import ProductCountChart from './Products/ProductCountChart.jsx';
import PaymentMethodsCard from './Products/PaymentsMethodsChart.jsx';
import TopSellingProductsCard from './Products/TopSellingProductsChart.jsx';
import OrderStatusCards from './Products/OrderStatusCard.jsx';
import { useLocation } from 'react-router-dom';

const Dashboard = () => {

  const location = useLocation();

  return (
    <div key={location.pathname} className="p-6">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">¡Bienvenido Admin!</h2>
        <p className='text-green-900 my-4'>Panel de inicio de gestion de administrador</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <OrderStatusCards />
          <PaymentMethodsCard />
          <TopSellingProductsCard />
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <ProductStockChart height={300} />
          <ProductCountChart height={300} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
