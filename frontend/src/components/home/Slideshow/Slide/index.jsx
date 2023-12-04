import { Link } from 'react-router-dom';

import styles from './Slide.module.css';

function Slide({ to, img, title, desc }) {
  const backgroundImageUrl = process.env.PUBLIC_URL + `/images/${img}`;
  const desc_list = desc.split("\n")

  return (
    <div
      className={styles.wrapper}
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
    >
      <Link to={to} className={styles.card}>
        <h6 className='h6'>{title}</h6>
        {desc_list.map((text, i) => (
          <p key={i}>{text}</p>
        ))}
      </Link>
    </div>
  );
}

export default Slide;
