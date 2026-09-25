"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, X, Trash2, User, Menu, Plus, Minus } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { useAuth } from "@/components/AuthProvider";
import { AuthModal } from "@/components/AuthModal";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [announcementDismissed, setAnnouncementDismissed] = useState(false);
  const { items, cartCount, cartTotal, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, itemPrice } = useCart();
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);

  // Check localStorage for dismissed announcement
  useEffect(() => {
    if (typeof window !== "undefined") {
      setAnnouncementDismissed(localStorage.getItem("makulayo_announce_dismissed") === "true");
    }
  }, []);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Escape key handler for mobile menu and cart
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isCartOpen) setIsCartOpen(false);
        if (mobileMenuOpen) setMobileMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isCartOpen, mobileMenuOpen, setIsCartOpen]);

  // Listen for global openAuthModal event
  useEffect(() => {
    const handleOpenAuth = () => setIsAuthModalOpen(true);
    window.addEventListener("openAuthModal", handleOpenAuth);
    return () => window.removeEventListener("openAuthModal", handleOpenAuth);
  }, []);

  // Focus trap for cart drawer
  useEffect(() => {
    if (!isCartOpen || !cartRef.current) return;
    const focusable = cartRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length > 0) focusable[0].focus();
  }, [isCartOpen]);

  // Lock body scroll when mobile menu or cart is open
  useEffect(() => {
    if (mobileMenuOpen || isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen, isCartOpen]);

  const dismissAnnouncement = () => {
    setAnnouncementDismissed(true);
    localStorage.setItem("makulayo_announce_dismissed", "true");
  };

  const navLinks = [
    { href: "/#collection", label: "COLLECTION" },
    { href: "/about", label: "ABOUT" },
    { href: "/shipping", label: "SHIPPING" },
  ];

  // Free shipping progress
  const freeShippingThreshold = 1999;
  const subTotal = items.reduce((total, item) => total + item.quantity * itemPrice, 0);
  const freeShippingRemaining = Math.max(0, freeShippingThreshold - subTotal);
  const freeShippingProgress = Math.min(100, (subTotal / freeShippingThreshold) * 100);

  return (
    <>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* Announcement Bar */}
      {!announcementDismissed && (
        <div
          className="fixed top-0 left-0 w-full z-[110] flex items-center overflow-hidden"
          style={{
            height: "36px",
            background: "#FFFFFF",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div className="flex animate-marquee whitespace-nowrap" style={{ width: "max-content" }}>
            {[...Array(10)].map((_, i) => (
              <span
                key={i}
                className="uppercase inline-block px-4"
                style={{
                  color: "#000000",
                  fontSize: "var(--caption)",
                  letterSpacing: "var(--tracking-eyebrow)",
                  fontWeight: 600,
                }}
              >
                FREE SHIPPING ON ORDERS OVER ₹1999 &nbsp;&nbsp; • &nbsp;&nbsp; 10% OFF ON FIRST ORDER &nbsp;&nbsp; • &nbsp;&nbsp;
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <nav
        className="fixed left-0 w-full z-[100] transition-all"
        style={{
          top: announcementDismissed ? 0 : "36px",
          height: "72px",
          background: scrolled ? undefined : "transparent",
          borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
          transitionDuration: "var(--duration)",
          transitionTimingFunction: "var(--ease)",
        }}
      >
        <div
          className="absolute inset-0 nav-glass transition-opacity duration-300"
          style={{ zIndex: -1, opacity: scrolled ? 1 : 0 }}
        />
        <div className="h-full max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between">
          {/* Left: Wordmark */}
          <Link href="/" className="flex items-start shrink-0">
            <span className="logo-text text-2xl md:text-3xl font-bold">
              MAKULAYO<span className="text-[0.35em] font-normal tracking-normal relative -top-[1.5em] ml-[-0.4em]">™</span>
            </span>
          </Link>

          {/* Centre: Nav Links (desktop) */}
          <div className="hidden md:flex items-center justify-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors"
                style={{
                  color: "var(--text-muted)",
                  fontSize: "var(--caption)",
                  letterSpacing: "var(--tracking-eyebrow)",
                  fontFamily: "var(--font-body)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right: Icons */}
          <div className="flex items-center gap-2">
            {/* Account icon (desktop) */}
            <div className="hidden md:block">
              {user ? (
                <Link
                  href="/account"
                  className="flex items-center justify-center w-10 h-10 transition-colors"
                  style={{ color: "var(--text)" }}
                  aria-label="Account"
                >
                  <div
                    className="w-7 h-7 flex items-center justify-center"
                    style={{
                      border: "1px solid var(--border-strong)",
                      borderRadius: "var(--radius-sm)",
                    }}
                  >
                    <span
                      className="text-[11px] font-bold uppercase"
                      style={{ color: "var(--gold)" }}
                    >
                      {user.name.charAt(0)}
                    </span>
                  </div>
                </Link>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center justify-center w-10 h-10 transition-colors"
                  style={{ color: "var(--text-muted)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
                  aria-label="Sign in"
                >
                  <User size={20} strokeWidth={1.5} />
                </button>
              )}
            </div>

            {/* Cart icon */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center justify-center w-10 h-10 transition-colors"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              aria-label={`Cart, ${cartCount} items`}
            >
              <ShoppingCart size={20} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 text-[10px] font-bold h-[18px] min-w-[18px] flex items-center justify-center"
                  style={{
                    background: "var(--gold)",
                    color: "var(--bg)",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "10px",
                  }}
                >
                  {cartCount}
                </span>
              )}
            </button>

            {/* Hamburger (mobile) */}
            <button
              className="md:hidden flex items-center justify-center w-10 h-10 transition-colors"
              style={{ color: "var(--text-muted)" }}
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            ref={mobileMenuRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
            style={{ background: "var(--bg)" }}
          >
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-5 right-5 w-11 h-11 flex items-center justify-center transition-colors"
              style={{ color: "var(--text-muted)" }}
              aria-label="Close menu"
            >
              <X size={24} strokeWidth={1.5} />
            </button>

            <nav className="flex flex-col items-center gap-12">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.1 + i * 0.08,
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "var(--display-lg)",
                      letterSpacing: "var(--tracking-display-lg)",
                      color: "var(--text)",
                    }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {/* Auth link in mobile menu */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.34, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                {user ? (
                  <Link
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      fontSize: "var(--eyebrow)",
                      letterSpacing: "var(--tracking-eyebrow)",
                      color: "var(--gold)",
                    }}
                  >
                    MY ACCOUNT
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsAuthModalOpen(true);
                    }}
                    style={{
                      fontSize: "var(--eyebrow)",
                      letterSpacing: "var(--tracking-eyebrow)",
                      color: "var(--gold)",
                    }}
                  >
                    SIGN IN
                  </button>
                )}
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 z-[150]"
              style={{ background: "rgba(0,0,0,0.6)" }}
            />

            <motion.div
              ref={cartRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 right-0 h-full w-full max-w-md z-[150] flex flex-col shadow-2xl"
              style={{
                background: "var(--surface)",
                borderLeft: "1px solid var(--border)",
              }}
              role="dialog"
              aria-label="Shopping cart"
            >
              {/* Cart Header */}
              <div
                className="p-6 flex justify-between items-center"
                style={{ borderBottom: "1px solid var(--border)" }}
              >
                <h2
                  className="font-bold"
                  style={{
                    color: "var(--text)",
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--display-md)",
                    letterSpacing: "var(--tracking-display-md)",
                  }}
                >
                  YOUR CART
                </h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-10 h-10 flex items-center justify-center transition-colors"
                  style={{ color: "var(--text-muted)" }}
                  aria-label="Close cart"
                >
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>

              {/* Free Shipping Progress */}
              {items.length > 0 && (
                <div className="px-6 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
                  <p className="mb-2" style={{ fontSize: "var(--caption)", color: "var(--text-muted)" }}>
                    {freeShippingRemaining > 0
                      ? `₹${freeShippingRemaining.toLocaleString("en-IN")} away from free shipping`
                      : "You qualify for free shipping!"}
                  </p>
                  <div
                    className="w-full h-[2px] overflow-hidden"
                    style={{ background: "var(--border)" }}
                  >
                    <div
                      className="h-full transition-all"
                      style={{
                        width: `${freeShippingProgress}%`,
                        background: "var(--gold)",
                        transitionDuration: "var(--duration)",
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center gap-4">
                    <ShoppingCart size={40} strokeWidth={1} style={{ color: "var(--text-faint)", opacity: 0.4 }} />
                    <p style={{ color: "var(--text-muted)", fontSize: "var(--body)" }}>Your cart is empty.</p>
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex gap-4 items-center p-4"
                      style={{
                        background: "var(--surface-alt)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      <div className="relative w-16 h-20 flex-shrink-0 overflow-hidden" style={{ background: "var(--bg)" }}>
                        <Image
                          src={item.product.image}
                          alt={`${item.product.name} Eau de Parfum bottle`}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4
                          className="font-medium truncate"
                          style={{ color: "var(--text)", fontSize: "var(--body)", fontFamily: "var(--font-body)" }}
                        >
                          {item.product.name}
                        </h4>
                        <p style={{ fontSize: "var(--caption)", color: "var(--text-faint)" }}>
                          50ml · Eau de Parfum
                        </p>
                        <p className="mt-1 font-medium" style={{ color: "var(--gold)", fontSize: "var(--body)" }}>
                          ₹{(itemPrice * item.quantity).toLocaleString("en-IN")}
                        </p>
                      </div>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (item.quantity <= 1) {
                              removeFromCart(item.product.id);
                            } else {
                              updateQuantity(item.product.id, item.quantity - 1);
                            }
                          }}
                          className="w-7 h-7 flex items-center justify-center transition-colors"
                          style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span style={{ color: "var(--text)", fontSize: "var(--caption)", minWidth: "1.5ch", textAlign: "center" }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center transition-colors"
                          style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="w-8 h-8 flex items-center justify-center transition-colors"
                        style={{ color: "var(--text-faint)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--error)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-faint)")}
                        aria-label={`Remove ${item.product.name} from cart`}
                      >
                        <Trash2 size={16} strokeWidth={1.5} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Cart Footer */}
              {items.length > 0 && (
                <div className="p-6" style={{ borderTop: "1px solid var(--border)", background: "var(--bg)" }}>
                  <div className="flex justify-between mb-4" style={{ color: "var(--text)" }}>
                    <span style={{ fontSize: "var(--body)", letterSpacing: "var(--tracking-eyebrow)" }}>SUBTOTAL</span>
                    <span className="font-medium" style={{ fontSize: "var(--body-lg)" }}>
                      ₹{cartTotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      if (!user) {
                        setIsAuthModalOpen(true);
                      } else {
                        window.location.href = "/checkout";
                      }
                    }}
                    className="block w-full text-center py-4 transition-all"
                    style={{
                      border: "1px solid var(--gold)",
                      background: "transparent",
                      color: "var(--gold)",
                      fontSize: "var(--eyebrow)",
                      letterSpacing: "var(--tracking-eyebrow)",
                      fontFamily: "var(--font-body)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "var(--gold-glow)";
                      e.currentTarget.style.borderColor = "var(--gold-hover)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.borderColor = "var(--gold)";
                    }}
                  >
                    PROCEED TO CHECKOUT
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
