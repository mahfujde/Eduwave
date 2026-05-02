import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import NotificationBar from "@/components/NotificationBar";
import NotificationPopup from "@/components/NotificationPopup";
import SectionBanner from "@/components/SectionBanner";
import ThemeLoader from "@/components/ThemeLoader";
import ScrollAnimator from "@/components/ScrollAnimator";

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
      <main className="min-h-screen pt-16 md:pt-24">
        <SectionBanner />
        {children}
      </main>
      <Footer />
      <WhatsAppFloat />
      <NotificationPopup />
      <ScrollAnimator />
    </>
  );
}
