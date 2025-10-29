import './css/App.css';
import 'prosemirror-view/style/prosemirror.css';
import AppRoutes from './routes/AppRoutes.jsx';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {

  return (
    <>
    <AppRoutes/>
     <ToastContainer
        position="bottom-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
    </>
  )
}

export default App
