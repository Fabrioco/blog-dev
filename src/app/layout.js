import { Montserrat } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body
        className={`${montserrat.className} antialiased container min-h-screen flex flex-col items-center justify-center px-4 py-2`}
      >
        <ToastContainer />
        {children}
      </body>
    </html>
  );
}
