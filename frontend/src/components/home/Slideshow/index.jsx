import { useAuth } from '../../../context/AuthContext';

import { useState } from 'react';
import Slide from './Slide';
import { slides } from '../../../constants/slides'

import styles from './Slideshow.module.css';

function Slideshow() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const { token } = useAuth(); 

  // auto toggling of slides, disabled for now because it's distracting the users from reading info
  // useEffect(() => {
  //   const updateSlideIdx = () =>
  //     setCurrentIdx((prevIdx) => (prevIdx + 1) % slides.length);
  //   const interval = setInterval(updateSlideIdx, 10000);

  //   return () => clearInterval(interval);
  // }, []);

  return (
    <section className={styles.wrapper}>
      <div className={styles.slider}>
        <Slide
          to={!token? '' : slides[currentIdx].link}
          img={slides[currentIdx].img}
          title={slides[currentIdx].title}
          desc={slides[currentIdx].desc}
        />
      </div>

      <div className={styles.nav}>
        {Array.from({ length: slides.length }).map((_, i) => (
          <button
            key={i}
            className={`${styles.slideIdx} ${i === currentIdx ? styles.active : ""}`}
            onClick={() => setCurrentIdx(i)}
          ></button>
        ))}
      </div>
    </section>
  );
}

export default Slideshow;
