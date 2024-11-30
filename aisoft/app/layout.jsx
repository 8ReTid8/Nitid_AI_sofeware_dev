import Nav from "../component/navbar";
import "./globals.css";

export default function layout({ children }) {
    return (
        <html>
            <body>
                <div className="sticky top-0 z-50">
                    <Nav />
                </div>
                <main className="h-full bg-base-200 min-h-screen pt-5">
                    {children}
                </main>
            </body>
        </html>
    )
}