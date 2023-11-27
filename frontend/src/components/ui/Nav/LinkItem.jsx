import { NavLink } from 'react-router-dom';

import styles from './Nav.module.css';

function LinkItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive ? `${styles.link} ${styles.active}` : `${styles.link}`
      }
    >
      {children}
    </NavLink>
  );
}

export default LinkItem;
