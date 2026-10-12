import { FormEvent, useEffect, useState } from "react"

type IconName = "arrow" | "archive" | "check" | "chevron" | "cloud" | "code" | "headset" | "mobile" | "play" | "quote" | "security" | "training"

const iconPaths: Record<IconName, React.ReactNode> = {
  arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
  archive: (
    <>
      <path d="M4 7h16M5 7l1 13h12l1-13M3 4h18v3H3z" />
      <path d="M9 11h6" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  chevron: <path d="m8 10 4 4 4-4" />,
  cloud: <path d="M7 18a5 5 0 1 1 1-9.9A6 6 0 0 1 20 10a4 4 0 0 1-1 8H7Z" />,
  code: <path d="m8 9-3 3 3 3m8-6 3 3-3 3m-3-9-2 12" />,
  headset: (
    <>
      <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
      <path d="M4 13h3v6H5a1 1 0 0 1-1-1v-5Zm16 0h-3v6h2a1 1 0 0 0 1-1v-5ZM17 19c0 1.1-.9 2-2 2h-3" />
    </>
  ),
  mobile: (
    <>
      <rect x="7" y="2.5" width="10" height="19" rx="2" />
      <path d="M10 5h4m-3 13h2" />
    </>
  ),
  play: <path d="m10 8 6 4-6 4V8Z" />,
  quote: (
    <path d="M7 17H4a1 1 0 0 1-1-1v-4a5 5 0 0 1 5-5v2a3 3 0 0 0-3 3h2v5Zm10 0h-3a1 1 0 0 1-1-1v-4a5 5 0 0 1 5-5v2a3 3 0 0 0-3 3h2v5Z" />
  ),
  security: (
    <>
      <path d="M12 3 5 6v5c0 4.6 2.8 8 7 10 4.2-2 7-5.4 7-10V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  training: (
    <>
      <path d="m3 9 9-5 9 5-9 5-9-5Z" />
      <path d="M7 12v4c3 2 7 2 10 0v-4m4-3v6" />
    </>
  ),
}

function Icon({ name, size = 24 }: { name: IconName; size?: number }) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      width={size}
    >
      {iconPaths[name]}
    </svg>
  )
}

const services = [
  {
    icon: "code" as IconName,
    number: "01",
    title: "Solutions web",
    text: "Sites vitrines, plateformes métier et e-commerce conçus pour convertir et évoluer avec vous.",
    tags: ["React", "E-commerce", "SEO"],
  },
  {
    icon: "mobile" as IconName,
    number: "02",
    title: "Applications mobiles",
    text: "Des expériences iOS et Android intuitives qui rapprochent votre activité de vos clients.",
    tags: ["iOS & Android", "Flutter", "UX/UI"],
  },
  {
    icon: "headset" as IconName,
    number: "03",
    title: "Maintenance IT",
    text: "Une infrastructure fiable, supervisée et maintenue pour assurer la continuité de vos opérations.",
    tags: ["Support", "Monitoring", "24/7"],
  },
  {
    icon: "security" as IconName,
    number: "04",
    title: "Cybersécurité",
    text: "Audit, protection et sauvegarde de vos données pour travailler l'esprit tranquille.",
    tags: ["Audit", "Protection", "Backup"],
  },
  {
    icon: "training" as IconName,
    number: "05",
    title: "Formation digitale",
    text: "Des programmes pratiques et personnalisés pour rendre vos équipes plus autonomes.",
    tags: ["Sur mesure", "Certifiant", "Pratique"],
  },
  {
    icon: "archive" as IconName,
    number: "06",
    title: "Cloud & archivage",
    text: "Vos documents centralisés, sécurisés et accessibles au bon moment, où que vous soyez.",
    tags: ["Cloud", "GED", "Migration"],
  },
]

const faqs = [
  {
    question: "Travaillez-vous uniquement avec des entreprises au Gabon ?",
    answer:
      "Nous sommes basés à Libreville et accompagnons des entreprises partout au Gabon, mais aussi à distance dans toute la sous-région.",
  },
  {
    question: "Combien de temps faut-il pour lancer un projet web ?",
    answer:
      "Un site vitrine peut être livré en 3 à 6 semaines. Après un premier échange, nous vous remettons un calendrier précis adapté à votre projet.",
  },
  {
    question: "Proposez-vous un accompagnement après la livraison ?",
    answer:
      "Oui. Chaque projet inclut une prise en main, puis nous proposons des formules de maintenance et de support adaptées à votre activité.",
  },
]

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState(0)
  const [formStatus, setFormStatus] =
    useState<"idle" | "sending" | "success" | "error">("idle")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 },
    )

    document
      .querySelectorAll(".reveal")
      .forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  const submitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)

    setFormStatus("sending")

    try {
      const response = await fetch("/api/contact.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      })

      if (!response.ok) {
        throw new Error("L'envoi du message a échoué.")
      }

      setFormStatus("success")
      form.reset()
    } catch {
      setFormStatus("error")
    }
  }

  return (
    <div className="site-shell">
      <header className="navbar">
        <a className="brand" href="#accueil" aria-label="Atitech, accueil">
          <span className="brand-logo-crop">
            <img
              className="brand-logo"
              src={`${import.meta.env.BASE_URL}logo-atitech.png`}
              alt="Atitech"
            />
          </span>
        </a>

        <nav
          className={menuOpen ? "nav-links open" : "nav-links"}
          aria-label="Navigation principale"
        >
          <a href="#accueil" onClick={() => setMenuOpen(false)}>
            Accueil
          </a>
          <a href="#services" onClick={() => setMenuOpen(false)}>
            Services
          </a>
          <a href="#expertise" onClick={() => setMenuOpen(false)}>
            Pourquoi nous
          </a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>
            Contact
          </a>
        </nav>

        <a className="nav-cta" href="#contact">
          Parlons de votre projet <Icon name="arrow" size={18} />
        </a>
        <button
          className={menuOpen ? "menu-button active" : "menu-button"}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Ouvrir le menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
        </button>
      </header>

      <main>
        <section className="hero" id="accueil">
          <div className="hero-glow" />
          <div className="hero-grid" />
          <div className="hero-copy">
            <div className="eyebrow hero-eyebrow">
              <span className="pulse-dot" />
              Votre partenaire digital à Libreville
            </div>
            <h1>
              La technologie qui
              <span> fait avancer votre entreprise.</span>
            </h1>
            <p className="hero-lead">
              Nous imaginons des solutions digitales fiables, simples et
              performantes pour transformer vos ambitions en résultats concrets.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#contact">
                Démarrer un projet <Icon name="arrow" size={19} />
              </a>
              <a className="button button-ghost" href="#services">
                <span className="play-icon">
                  <Icon name="play" size={17} />
                </span>
                Découvrir notre expertise
              </a>
            </div>
            <div className="hero-trust">
              <div className="avatars" aria-hidden="true">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80"
                  alt=""
                />
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80"
                  alt=""
                />
                <img
                  src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&q=80"
                  alt=""
                />
              </div>
              <div>
                <strong>98% de clients satisfaits</strong>
                <span>Une relation fondée sur la confiance</span>
              </div>
            </div>
          </div>

          <div
            className="hero-visual"
            aria-label="Équipe Atitech en collaboration"
          >
            <div className="image-frame">
              <img
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1200"
                alt="Équipe technologique africaine travaillant ensemble"
              />
              <div className="image-tint" />
            </div>
            <div className="float-card float-card-top">
              <span className="float-icon">
                <Icon name="security" size={20} />
              </span>
              <span>
                <strong>Solutions sécurisées</strong>
                <small>Protection par conception</small>
              </span>
              <Icon name="check" size={18} />
            </div>
            <div className="float-card float-card-bottom">
              <span className="mini-chart">
                <i />
                <i />
                <i />
                <i />
                <i />
              </span>
              <span>
                <strong>+40%</strong>
                <small>de productivité moyenne</small>
              </span>
            </div>
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
          </div>

          <div className="hero-metrics">
            <div>
              <strong>50+</strong>
              <span>projets accompagnés</span>
            </div>
            <div>
              <strong>5 ans</strong>
              <span>d'expertise terrain</span>
            </div>
            <div>
              <strong>24/7</strong>
              <span>support disponible</span>
            </div>
            <div>
              <strong>100%</strong>
              <span>solutions sur mesure</span>
            </div>
          </div>
        </section>

        <section className="services section" id="services">
          <div className="section-heading reveal">
            <div>
              <span className="eyebrow">Nos expertises</span>
              <h2>Un partenaire unique pour tous vos enjeux digitaux.</h2>
            </div>
            <p>
              De l'idée à la mise en production, nos experts conçoivent des
              solutions robustes qui simplifient votre quotidien et accélèrent
              votre croissance.
            </p>
          </div>

          <div className="service-grid">
            {services.map((service, index) => (
              <article
                className="service-card reveal"
                key={service.title}
                style={{ "--delay": `${index * 60}ms` } as React.CSSProperties}
              >
                <div className="service-top">
                  <span className="service-icon">
                    <Icon name={service.icon} />
                  </span>
                  <span className="service-number">{service.number}</span>
                </div>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <div className="tag-list">
                  {service.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <a href="#contact" aria-label={`Parler de ${service.title}`}>
                  En savoir plus <Icon name="arrow" size={18} />
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="expertise section" id="expertise">
          <div className="expertise-photo reveal">
            <img
              src="https://images.unsplash.com/photo-1573164574397-dd250bc8a598?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1200"
              alt="Professionnelles réunies autour d'un ordinateur"
            />
            <div className="experience-badge">
              <strong>5+</strong>
              <span>années à vos côtés</span>
            </div>
          </div>
          <div className="expertise-copy reveal">
            <span className="eyebrow">Pourquoi Atitech</span>
            <h2>
              La proximité d'une équipe locale. L'exigence des meilleurs
              standards.
            </h2>
            <p className="large-copy">
              Nous ne livrons pas seulement de la technologie. Nous prenons le
              temps de comprendre votre métier pour bâtir une solution vraiment
              utile, durable et maîtrisée.
            </p>
            <div className="benefits">
              <div>
                <span>
                  <Icon name="check" size={18} />
                </span>
                <p>
                  <strong>Un interlocuteur dédié</strong>Du cadrage au support,
                  vous savez toujours qui appeler.
                </p>
              </div>
              <div>
                <span>
                  <Icon name="check" size={18} />
                </span>
                <p>
                  <strong>Des délais clairs</strong>Une méthode transparente et
                  des points réguliers.
                </p>
              </div>
              <div>
                <span>
                  <Icon name="check" size={18} />
                </span>
                <p>
                  <strong>Une solution qui vous appartient</strong>
                  Documentation, formation et autonomie garanties.
                </p>
              </div>
            </div>
            <a className="text-link" href="#contact">
              Découvrir notre méthode <Icon name="arrow" size={19} />
            </a>
          </div>
        </section>

        <section className="process section">
          <div className="process-heading reveal">
            <span className="eyebrow">Une méthode simple</span>
            <h2>Votre projet, sans zone d'ombre.</h2>
            <p>
              Quatre étapes claires pour avancer sereinement, du premier échange
              à la réussite.
            </p>
          </div>
          <div className="process-list">
            {[
              [
                "01",
                "Écoute",
                "Nous clarifions vos besoins, vos utilisateurs et vos priorités.",
              ],
              [
                "02",
                "Conception",
                "Nous transformons vos objectifs en une solution claire et élégante.",
              ],
              [
                "03",
                "Réalisation",
                "Vous suivez chaque avancée et validez les étapes clés avec nous.",
              ],
              [
                "04",
                "Accompagnement",
                "Nous formons vos équipes et restons présents après le lancement.",
              ],
            ].map(([number, title, text], index) => (
              <article
                className="process-step reveal"
                key={number}
                style={{ "--delay": `${index * 80}ms` } as React.CSSProperties}
              >
                <span className="step-number">{number}</span>
                <div className="step-line">
                  <i />
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="testimonial section">
          <div className="testimonial-card reveal">
            <span className="quote-icon">
              <Icon name="quote" size={34} />
            </span>
            <blockquote>
              “Atitech a compris notre activité avant même de parler
              technologie. Le résultat est simple à utiliser, professionnel et
              nous fait gagner un temps précieux chaque semaine.”
            </blockquote>
            <div className="testimonial-person">
              <div className="person-initials">AM</div>
              <div>
                <strong>Alex Moussavou</strong>
                <span>Directeur des opérations, Libreville</span>
              </div>
              <div className="stars" aria-label="5 étoiles">
                ★★★★★
              </div>
            </div>
          </div>
          <div className="faq-block reveal">
            <span className="eyebrow">Questions fréquentes</span>
            <h2>Avant de nous confier votre projet.</h2>
            <div className="faq-list">
              {faqs.map((faq, index) => (
                <div
                  className={openFaq === index ? "faq-item open" : "faq-item"}
                  key={faq.question}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                    aria-expanded={openFaq === index}
                  >
                    {faq.question}
                    <Icon name="chevron" size={20} />
                  </button>
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="contact section" id="contact">
          <div className="contact-copy reveal">
            <span className="eyebrow eyebrow-light">
              Parlons de votre projet
            </span>
            <h2>Prêt à transformer votre prochaine idée en réussite ?</h2>
            <p>
              Expliquez-nous votre besoin. Un expert Atitech vous répond sous 24
              heures avec des premières pistes concrètes.
            </p>
            <div className="contact-details">
              <a href="tel:+24174466862">
                <span>01</span>
                <div>
                  <small>Téléphone</small>
                  <strong>+241 74 46 68 62</strong>
                </div>
              </a>
              <a href="mailto:contact.atitech@gmail.com">
                <span>02</span>
                <div>
                  <small>Email</small>
                  <strong>contact.atitech@gmail.com</strong>
                </div>
              </a>
              <a href="https://wa.me/24162059836">
                <span>03</span>
                <div>
                  <small>WhatsApp</small>
                  <strong>+241 62 05 98 36</strong>
                </div>
              </a>
            </div>
          </div>
          <form className="contact-form reveal" onSubmit={submitForm}>
            <div className="form-heading">
              <h3>Dites-nous tout.</h3>
              <span>Réponse sous 24h</span>
            </div>
            <div className="field-row">
              <label>
                Votre nom
                <input name="name" placeholder="Ex. Jean Mba" required />
              </label>
              <label>
                Votre email
                <input
                  name="email"
                  type="email"
                  placeholder="vous@entreprise.com"
                  required
                />
              </label>
            </div>
            <label>
              Service recherché
              <select name="service" defaultValue="">
                <option value="" disabled>
                  Sélectionnez un service
                </option>
                <option>Développement web</option>
                <option>Application mobile</option>
                <option>Maintenance IT</option>
                <option>Cybersécurité</option>
                <option>Formation</option>
                <option>Autre</option>
              </select>
            </label>
            <label>
              Parlez-nous de votre projet
              <textarea
                name="message"
                rows={4}
                placeholder="Vos objectifs, vos délais, votre contexte..."
                required
              />
            </label>
            <label className="website-field" aria-hidden="true">
              Site internet
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
            <button
              className="button button-primary form-submit"
              type="submit"
              disabled={formStatus === "sending"}
            >
              {formStatus === "sending"
                ? "Envoi en cours..."
                : "Envoyer ma demande"}
              <Icon name="arrow" size={19} />
            </button>
            {formStatus === "success" && (
              <p className="success-message">
                Message envoyé. Un accusé de réception vient de vous être
                adressé.
              </p>
            )}
            {formStatus === "error" && (
              <p className="error-message">
                L’envoi a échoué. Réessayez ou écrivez-nous directement par
                email.
              </p>
            )}
            <small className="form-note">
              Vos informations restent strictement confidentielles.
            </small>
          </form>
        </section>
      </main>

      <footer>
        <div className="footer-main">
          <div className="footer-brand">
            <a className="brand brand-light" href="#accueil">
              <span className="footer-logo-frame">
                <span className="brand-logo-crop footer-logo-crop">
                  <img
                    className="brand-logo footer-logo"
                    src={`${import.meta.env.BASE_URL}logo-atitech.png`}
                    alt="Atitech"
                  />
                </span>
              </span>
            </a>
            <p>
              Des solutions numériques pensées au Gabon, conçues pour faire
              grandir votre entreprise.
            </p>
          </div>
          <div>
            <strong>Navigation</strong>
            <a href="#services">Nos services</a>
            <a href="#expertise">Pourquoi nous</a>
            <a href="#contact">Nous contacter</a>
          </div>
          <div>
            <strong>Services</strong>
            <a href="#services">Solutions web</a>
            <a href="#services">Applications mobiles</a>
            <a href="#services">Support & sécurité</a>
          </div>
          <div>
            <strong>Nous trouver</strong>
            <span>Libreville, Gabon</span>
            <span>Lun – Ven, 8h – 18h</span>
            <a href="mailto:contact.atitech@gmail.com">
              contact.atitech@gmail.com
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2025 Atitech Gabon. Tous droits réservés.</span>
          <span>Conçu avec exigence à Libreville.</span>
        </div>
      </footer>
    </div>
  )
}