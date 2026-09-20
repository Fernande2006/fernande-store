import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import WhatsAppFloatingButton from "./components/WhatsAppFloatingButton";
import CartDrawer from "./components/CartDrawer";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";

export default function App() {
  return (
    <div className="min-h-screen bg-cream font-body text-ink">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/produit/:id" element={<ProductPage />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppFloatingButton />
      <CartDrawer />
    </div>
  );
}
