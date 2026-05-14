import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "O You Who Believe | يَـٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟",
  description:
    "Explore the 89 Quranic verses that begin with 'O you who believe' — with Arabic text, English translation, audio recitation, and community reflections.",
  keywords: [
    "Quran",
    "O you who believe",
    "ya ayyuha alladhina amanu",
    "Islamic",
    "Quranic verses",
    "Quran Foundation",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        <footer className="footer">
          <p>
            Powered by{" "}
            <a
              href="https://quran.foundation"
              target="_blank"
              rel="noopener noreferrer"
            >
              Quran Foundation
            </a>{" "}
            APIs · Built with Next.js
          </p>
        </footer>
      </body>
    </html>
  );
}
