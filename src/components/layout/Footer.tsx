import Link from "next/link";
import styles from "./Footer.module.css";
import { Twitter, Instagram, Linkedin, Github } from "lucide-react";

export function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.top}>
                    <div className={styles.brand}>
                        <Link href="/" className={styles.logo}>Finova</Link>
                        <p className={styles.tagline}>Own your wealth.</p>
                        <div className={styles.social}>
                            <a href="#" className={styles.socialLink}><Twitter size={20} /></a>
                            <a href="#" className={styles.socialLink}><Instagram size={20} /></a>
                            <a href="#" className={styles.socialLink}><Linkedin size={20} /></a>
                            <a href="#" className={styles.socialLink}><Github size={20} /></a>
                        </div>
                    </div>

                    <div className={styles.links}>
                        <div className={styles.column}>
                            <h4>Product</h4>
                            <Link href="#">Features</Link>
                            <Link href="#">Pricing</Link>
                            <Link href="#">Security</Link>
                            <Link href="#">Changelog</Link>
                        </div>
                        <div className={styles.column}>
                            <h4>Company</h4>
                            <Link href="#">About</Link>
                            <Link href="#">Careers</Link>
                            <Link href="#">Blog</Link>
                            <Link href="#">Contact</Link>
                        </div>
                        <div className={styles.column}>
                            <h4>Resources</h4>
                            <Link href="#">Help Center</Link>
                            <Link href="#">Guides</Link>
                            <Link href="#">API Docs</Link>
                            <Link href="#">Status</Link>
                        </div>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <p>© 2024 Finova Inc. All rights reserved.</p>
                    <div className={styles.legal}>
                        <Link href="#">Privacy Policy</Link>
                        <Link href="#">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
