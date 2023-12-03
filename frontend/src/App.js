import './styles/global.css'

import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { AuthProvider } from './context/AuthContext';

import Layout from './components/ui/Layout';

import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

import Shelters from './pages/shelters/Shelters';
import Shelter from './pages/shelters/Shelter';
import ShelterEdit from './pages/shelters/ShelterEdit';

import Profile from './pages/profile/Profile';
import ProfileEdit from './pages/profile/ProfileEdit';
import ProfileOther from './pages/profile/ProfileOther';

import PetListings from './pages/petlistings/PetListings';
import PetDetail from './pages/petlistings/PetDetail';
import PetDetailEdit from './pages/petlistings/PetDetailEdit';

import ApplicationDetail from './pages/applications/ApplicationDetail';
import Applications from './pages/applications/Applications';

import Messages from './pages/messages/Messages';
import MessageDetail from './pages/messages/MessageDetail';

import Search from './pages/Search';

import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<Home />} />
            <Route path='login' element={<Login />} />
            <Route path='signup' element={<SignUp />} />

            <Route path='shelters' element={<Shelters />} />
            <Route path='shelters/:shelterId' element={<Shelter />} />
            <Route path='shelters/:shelterId/edit' element={<ShelterEdit />} />

            <Route path='profile' element={<Profile />} />
            <Route path='profile/edit' element={<ProfileEdit />} />
            <Route path='profile/:userId' element={<ProfileOther />} />
            
            <Route path='petlistings' element={<PetListings />} />
            <Route path='petlistings/:petId' element={<PetDetail />} />
            <Route path='petlistings/:petId/edit' element={<PetDetailEdit />} />

            <Route path='messages' element={<Messages />} />
            <Route path='messages/:recipientId' element={<MessageDetail />} />

            <Route path='applications' element={<Applications />} />
            <Route path='applications/:appId' element={<ApplicationDetail />} />

            <Route path='search' element={<Search />} />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;