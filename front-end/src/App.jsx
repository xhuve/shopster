import Header from "./components/Header";
import Footer from "./components/Footer";
import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useGetProfileQuery } from "./slices/usersApiSlice";
import { logout } from "./slices/authSlice";

function App() {

    const { error } = useGetProfileQuery()
    const dispatch = useDispatch()
  
    useEffect(() => {
      if (error?.data.message === "Unauthorized")
        dispatch(logout())
      }, [])

    return (
      <>
        <Header />
        <main>
          <Container>
            <Outlet />
          </Container>
        </main>
        <Footer />
        <ToastContainer />
      </>
    );
}

export default App;
