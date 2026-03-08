import { Link } from "react-router-dom";
import headshot from "../assets/images/headshot.jpeg";
import { GithubIcon, LinkedinIcon, MailIcon } from "../components/icons/Library";

export const Home = () => {
    return (
        <div className="home">
            <div className="container-border">
                <main className="container">
                    <header>
                        <img
                            className="headshot"
                            src={headshot}
                            alt="Katherine Rochon headshot"
                        />
                        <h1>Katherine Rochon</h1>
                        <p className="mittel">Full-Stack Creative Developer</p>
                    </header>

                    <section>
                        <h2 className="visually-hidden">Specializations</h2>
                        <p className="regular">
                            Web Applications | Graphic Design | Interactive
                            Design | Accessibility | AI
                        </p>
                    </section>
                    <div className="actions nav">
                        <Link to="/survivor" className="button">
                            Survivor
                        </Link>
                        {/* <Link to="/tier-list" className="button">
                            Tier List
                        </Link> */}
                    </div>

                    <aside
                        className="social-links"
                        aria-label="Social media links"
                    >
                        <a
                            href="https://www.linkedin.com/in/katherinerochon/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn profile"
                        >
                            <LinkedinIcon />
                        </a>
                        <a
                            href="mailto:katherinerochon.dev@gmail.com"
                            aria-label="Email Katherine"
                        >
                            <MailIcon />
                        </a>
                        <a
                            href="https://github.com/kgrochon"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub profile"
                        >
                            <GithubIcon />
                        </a>
                    </aside>
                </main>
            </div>
            <div className="shape-1" aria-hidden="true" />
            <div className="shape-2" aria-hidden="true" />
            <div className="shape-3" aria-hidden="true" />
            <div className="shape-4" aria-hidden="true" />
        </div>
    );
};
