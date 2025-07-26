
import './App.css';
import { Navigate, Route, Routes } from 'react-router-dom';

import StudentDashboard from './pages/StudentDashboard';
// import PcList from './pages/PcList';
import SearchBooks from './pages/SearchBooks';

import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';

import AdminDashboard from './pages/AdminDashboard';

import CreateBook from './pages/CreateBook';
import BookDetails from './pages/BookDetails';
import AllBooks from './pages/AllBooks';
import UpdateBook from './pages/updateBook';
import DeleteBook from './pages/DeleteBook';

import CreatePC from './pages/CreatePC';
import ListPC from './pages/ListPC';
import UpdatePC from './pages/UpdatePC';
import DeletePC from './pages/DeletePC';

import PCsDetails from './pages/PCsDetails';
import PcNotification from './pages/PcNotification';
import ReserveTime from './pages/ReserveTime';
import PcRequest from './pages/PcRequest';

import UserList from './pages/UserList';
import AddUser from './pages/AddUser';

import AddTeacher from './pages/AddTeacher';

import { useState } from 'react';
import RefrshHandler from './RefrshHandler';

// import SuperAdminLogin from './pages/SuperAdminLogin';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Borrowedbook from './pages/Borrowedbook';
import Reservedbook from './pages/Reservedbook';

import Allbooks from './pages/searchbook';
import BorrowConfirmation from './pages/BorrowConfirmation';

import ReserveBorrowBook from './pages/ReserveBorrowBook';

import LibrarianRequest from './pages/LibrarianRequest';

import Notifications from './pages/Notifications';
import AdminRequests from './pages/AdminRequests';

import Profile from './pages/Profile';

import Logout from './pages/Logout';
import SpineLabel from './pages/SpineLabel';
import UploadBook from './pages/UploadBook';
import ViewPDF from './pages/ViewPDF';





function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/api/login" />
  }
  return (

    <div className="App ">
    <RefrshHandler setIsAuthenticated={setIsAuthenticated} />
    <Routes>
     
      <Route path='/' element={ <Navigate to="/home" />} />
      <Route path='/home' element={ <Home />} />
      <Route path='/aboutus' element= { <AboutUs />} />
      <Route path='/contactus' element= { <ContactUs />} />

      <Route path='/api/signup' element={ < Signup />} />
      <Route path='/api/login' element={ < Login />} />

      {/* <Route path='/' element={ < SuperAdminLogin />} /> */}
      <Route path='/admin-dashboard' element={<PrivateRoute element={<AdminDashboard />} />} />
 
      <Route path='/student-dashboard' element={<PrivateRoute element={<StudentDashboard />} />} />
      {/* <Route path='/api/pc' element={<PcList />} /> */}
      <Route path='/search-books' element={<SearchBooks />} />
      <Route path='/borrow-book' element={<Borrowedbook />} />
      <Route path='/reserve-book' element={<Reservedbook />} />
      <Route path='/borrow-confirmation' element={<BorrowConfirmation />} />

      <Route path="/admin/create-book" element={<CreateBook />} />
      <Route path="/book-details/:AccNo" element={<BookDetails />} />
      <Route path="/spinelabel" element={<SpineLabel />} />
      <Route path="/admin/all-books" element={<AllBooks />} />
      <Route path="/admin/update-book" element={<UpdateBook />} />
      <Route path="/admin/update-book/:id" element={<UpdateBook />} />
      <Route path="/admin/delete-book" element={<DeleteBook />} />
      <Route path="/uploadbook" element={<UploadBook />} />
      <Route path="/viewpdf" element={<ViewPDF />} />

      <Route path="/admin/create-pc" element={<CreatePC />} />
      <Route path="/admin/list-pc" element={<ListPC />} />
      <Route path="/admin/update-pc/:id" element={<UpdatePC />} />
      <Route path="/admin/delete-pc/:id" element={<DeletePC />} />

      <Route path="/getUserViewPcs" element={<PCsDetails />} />
      <Route path="/notification" element={<PcNotification />} />
      <Route path="/reserve-time/:id" element={<ReserveTime />} />
      <Route path="/request" element={<PcRequest />} />

      <Route path="/admin/user" element={<UserList />} />
      <Route path="/add-user" element={<AddUser />} />
      <Route path="/api/users" element={<UserList />} />

      <Route path="/add-teacher" element={<AddTeacher />} />
      <Route path="/books" element={<Allbooks />} />

      <Route path="/reserve-borrow/:bookId" element={<ReserveBorrowBook type="reserve" />} />
      <Route path="/borrow-borrow/:bookId" element={<ReserveBorrowBook type="borrow" />} />
      <Route path="/librarian/requests" element={<LibrarianRequest />} />

      <Route path="/notifications" element={<Notifications />} />
      <Route path="/admin/requests" element={<AdminRequests />} />

      <Route path="/profile" element={<Profile />} />

      <Route path="/logout" element={<Logout />} />


    </Routes>
    </div>

  );
}

export default App;