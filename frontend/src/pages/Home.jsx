import { useAuth } from '../context/AuthContext'

import Slideshow from '../components/home/Slideshow'
import PetCategories from '../components/home/PetCategories'
import SheltersList from '../components/home/SheltersList'

function Home() {
  const { token } = useAuth()
  return (
    <div style={{padding: 'var(--padding-wide)'}}>
      <Slideshow />
      <PetCategories />
      {token? (
        <SheltersList />
      ) : (
        <></>
      )}
    </div>
  )
}

export default Home