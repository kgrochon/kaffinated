import "./App.css";
import headshot from "./assets/images/headshot.jpeg";
import { GithubIcon, LinkedinIcon, MailIcon } from "./assets/images/Library";

function App() {
    return (
        <div className="app">
            <div className="container-border">
                <main className="container">
                    <img
                        className="headshot"
                        src={headshot}
                        alt="Katherine headshot"
                    />
                    <h1>Katherine Rochon</h1>
                    <p className="mittel">Full-Stack Creative Developer</p>
                    <p className="regular">
                        Web Applications | Graphic Design | Interactive Design |
                        Accessibility | AI
                    </p>

                    <div className="social-links">
                        <a
                            href="https://www.linkedin.com/in/katherinerochon/"
                            target="_blank"
                        >
                            <LinkedinIcon />
                        </a>
                        <a
                            href="mailto:katherinerochon.dev@gmail.com"
                            target="_blank"
                        >
                            <MailIcon />
                        </a>
                        <a href="https://github.com/kgrochon" target="_blank">
                            <GithubIcon />
                        </a>
                    </div>
                    {/* <ToolIcon />
                    <p>
                        DESIGN |Figma | Phototshop | CSS | HTML | Typescript | React |
                        Node.js | Firebase | SQL | Three.js | AI | Cursor |
                        Github | Vite
                    </p> */}
                </main>
            </div>
            <div className="shape-1" />
            <div className="shape-2" />
            <div className="shape-3" />
            <div className="shape-4" />
        </div>
    );
}

export default App;
