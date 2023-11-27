import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebookSquare, faInstagram, faTwitterSquare, faTiktok } from '@fortawesome/free-brands-svg-icons'

import Input from '../form/Input'
import Button from '../Button'

import styles from './Footer.module.css'



function Footer() {
  return (
    <footer className={styles.footer}>
      <nav className={styles.nav}>
          <a href="/">Contact Us</a>
          <a href="/">Privcay Policy</a>
          <a href="/">Terms of Service</a>
      </nav>

      <div className={styles.social_media}>
        <p>Follow us at...</p>
        <div className="social_media_icons">
          <a href="/"><FontAwesomeIcon icon={faFacebookSquare} /></a>
          <a href="/"><FontAwesomeIcon icon={faInstagram} /></a>
          <a href="/"><FontAwesomeIcon icon={faTwitterSquare} /></a>
          <a href="/"><FontAwesomeIcon icon={faTiktok} /></a>
          
        </div>
      </div>

      <div className={styles.newsletter}>
        <h6 className="h6">Newsletter</h6>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>

        {/* Is this form supposed to do anything? */}
        <form id="newsletter_form">
          <Input type="email" name="email" id="newsletter_email" placeholder="Your email..." classes={styles.email} />
          <Button classes={styles.btn}>Subscribe</Button>
        </form>
      </div>
    </footer>
  )
}

export default Footer