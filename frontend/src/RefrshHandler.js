
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

function RefrshHandler({ setIsAuthenticated }) {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem('token')){
            setIsAuthenticated(true);
            if(location.pathname === '/' || 
                // location.pathname === '/login' || 
                // location.pathname === '/Adminlogin' || 
                // location.pathname === '/signup' ||
                location.pathname === '/Adminsignup'
            ){
                // navigate('/home', { replace : false });
                // navigate('/', { replace : false });
                // navigate('/admin-Dashboard', { replace : false });
            }
        }
    },[location, navigate, setIsAuthenticated])
    return (
        null
    )
}

export default RefrshHandler;
