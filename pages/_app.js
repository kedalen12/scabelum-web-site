import '../styles/globals.css'
import Navbar from '../components/Navbar'
import toast, { Toaster } from 'react-hot-toast';
import { UserContext } from '../lib/context';

import { useUserData } from '../lib/hooks';
import { auth, firestore } from '../lib/firebase';
import Footer from '../components/Footer';
function MyApp({ Component, pageProps }) {

  const userData = useUserData();
  return (
    <UserContext.Provider value={userData}>
    <Navbar />    
    <Component {...pageProps} />
    <Toaster />
    <Footer/>
    </UserContext.Provider>
  )
}

export default MyApp
