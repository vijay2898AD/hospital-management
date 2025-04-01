import { createBrowserRouter } from 'react-router-dom';
import AdminDashboard from './pages/admin/Dashboard';
import ContactUs from './pages/ContactUs';
import AboutUs from './pages/AboutUs';
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import Departments from './pages/Departments';
import Appointments from './pages/Appointments';
// Import other components as needed

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/admin/dashboard',
      element: <AdminDashboard />,
    },
    {
      path: '/contact',
      element: <ContactUs />,
    },
    {
      path: '/about',
      element: <AboutUs />,
    },
    {
      path: '/doctors',
      element: <Doctors />,
    },
    {
      path: '/departments',
      element: <Departments />,
    },
    {
      path: '/appointments',
      element: <Appointments />,
    },
    // Add other routes as needed
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }
  }
); 