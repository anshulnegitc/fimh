import Link from 'next/link'
import styles from "../page.module.css";

export default function Header() {
    return (
        <header className="row p-4 mb-4">
            <div className="col">
                <Link href="/" className={styles.logo}>
                    <span className="text-primary">
                        Free
                    </span>
                    <span className="text-danger">
                        Image
                    </span>
                    <span className="text-success">
                        Hosting
                    </span>
                </Link>

            </div>
        </header>
    )
}