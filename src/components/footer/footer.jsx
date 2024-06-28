import { FacebookIcon } from '../icons/facebook'
import { InstagramIcon } from '../icons/instagram'
import { TwitterIcon } from '../icons/twitter'
import { YoutubeIcon } from '../icons/youtube'
import styles from './footer.module.css'

const redes = [
  {
    Icon: FacebookIcon,
    href: 'https://www.facebook.com/U.deLaSalle',
    className: styles.facebook,
  },
  {
    Icon: TwitterIcon,
    href: 'https://twitter.com/unisalle',
    className: styles.twitter,
  },
  {
    Icon: YoutubeIcon,
    href: 'https://www.youtube.com/user/Lasallistas',
    className: styles.youtube,
  },
  {
    Icon: InstagramIcon,
    href: 'https://www.instagram.com/unisallecol/',
    className: styles.instagram,
  },
]

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.logo}>
        <h4>La salle</h4>
      </div>

      <div className={styles.info}>
        <h6>Facultad Ciencias de la Salud</h6>
        <h6>Optometría</h6>
      </div>

      <div className={styles.redes}>
        <p>Contáctate con nosotros</p>
        <div className={styles.redesMap}>
          {redes.map(({ Icon, className, href }) => (
            <a
              href={href}
              key={href}
              target='_blank'
              rel='noreferrer'
              className={`${styles.icon} ${className}`}>
              <Icon width={25} height={25} />
            </a>
          ))}
        </div>
      </div>
      <span className={styles.copy}>
        © 2023 La Salle - Todos los Derechos Reservados
      </span>
    </footer>
  )
}
