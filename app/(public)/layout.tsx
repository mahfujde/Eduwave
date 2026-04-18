import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import NotificationBar from "@/components/NotificationBar";
import NotificationPopup from "@/components/NotificationPopup";
import ThemeLoader from "@/components/ThemeLoader";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ThemeLoader />
      <NotificationBar />
      <Navbar />
      <main className="min-h-screen pt-24 md:pt-28">{children}</main>
      <Footer />
      <WhatsAppFloat />
      <NotificationPopup />
    </>
  );
}
