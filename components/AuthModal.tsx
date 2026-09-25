"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/AuthProvider";
import { X, Eye, EyeOff, Mail, Lock, User, ArrowLeft, Check, AlertCircle } from "lucide-react";
import Image from "next/image";

type AuthView = "sign-in" | "sign-up" | "forgot-password" | "check-email" | "confirmation-sent";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const { signIn, signUp, resetPassword } = useAuth();
    const [view, setView] = useState<AuthView>("sign-up");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const hasAccount = localStorage.getItem("makulayo_has_account");
            setView(hasAccount ? "sign-in" : "sign-up");
        }
    }, [isOpen]);

    const resetForm = () => {
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setFullName("");
        setError("");
        setShowPassword(false);
        setShowConfirmPassword(false);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const switchView = (newView: AuthView) => {
        setError("");
        setView(newView);
    };

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        const { error: err } = await signIn(email, password);

        if (err) {
            setError(err);
            setIsSubmitting(false);
        } else {
            localStorage.setItem("makulayo_has_account", "true");
            setIsSubmitting(false);
            handleClose();
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setIsSubmitting(true);
        const { error: err, needsConfirmation } = await signUp(email, password, fullName);

        if (err) {
            setError(err);
            setIsSubmitting(false);
        } else if (needsConfirmation) {
            localStorage.setItem("makulayo_has_account", "true");
            setIsSubmitting(false);
            setView("confirmation-sent");
        } else {
            // Signed in immediately (no email confirmation required)
            localStorage.setItem("makulayo_has_account", "true");
            setIsSubmitting(false);
            handleClose();
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        const { error: err } = await resetPassword(email);

        if (err) {
            setError(err);
            setIsSubmitting(false);
        } else {
            setIsSubmitting(false);
            setView("check-email");
        }
    };

    const renderView = () => {
        switch (view) {
            case "sign-in":
                return (
                    <motion.div
                        key="sign-in"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="text-center mb-8">
                            <h2 
                                className="mb-2"
                                style={{
                                    fontFamily: "var(--font-display)",
                                    fontSize: "var(--display-sm)",
                                    letterSpacing: "var(--tracking-display-sm)",
                                    color: "var(--text)"
                                }}
                            >
                                SIGN IN
                            </h2>
                            <p style={{ color: "var(--text-muted)", fontSize: "var(--body)" }}>
                                Access your MAKULAYO account
                            </p>
                        </div>

                        {error && <ErrorMessage message={error} />}

                        <form onSubmit={handleSignIn} className="space-y-4">
                            <InputField
                                icon={<Mail size={18} />}
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={setEmail}
                                required
                            />
                            <div className="relative">
                                <InputField
                                    icon={<Lock size={18} />}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    value={password}
                                    onChange={setPassword}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-ivory-muted hover:text-brand-ivory transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            <div className="text-right">
                                <button
                                    type="button"
                                    onClick={() => switchView("forgot-password")}
                                    className="text-xs text-brand-gold/70 hover:text-brand-gold transition-colors tracking-wide"
                                >
                                    Forgot password?
                                </button>
                            </div>

                            <SubmitButton isSubmitting={isSubmitting} label="Sign In" />
                        </form>

                        <div className="mt-8 text-center">
                            <span className="text-brand-ivory-muted text-sm">
                                New to MAKULAYO?{" "}
                            </span>
                            <button
                                onClick={() => switchView("sign-up")}
                                className="text-brand-gold text-sm font-medium hover:text-brand-gold/80 transition-colors"
                            >
                                Create an account
                            </button>
                        </div>
                    </motion.div>
                );

            case "sign-up":
                return (
                    <motion.div
                        key="sign-up"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="text-center mb-8">
                            <h2 
                                className="mb-2"
                                style={{
                                    fontFamily: "var(--font-display)",
                                    fontSize: "var(--display-sm)",
                                    letterSpacing: "var(--tracking-display-sm)",
                                    color: "var(--text)"
                                }}
                            >
                                JOIN THE FEW
                            </h2>
                            <p style={{ color: "var(--text-muted)", fontSize: "var(--body)" }}>
                                Create your MAKULAYO account
                            </p>
                        </div>

                        {error && <ErrorMessage message={error} />}

                        <form onSubmit={handleSignUp} className="space-y-4">
                            <InputField
                                icon={<User size={18} />}
                                type="text"
                                placeholder="Full name"
                                value={fullName}
                                onChange={setFullName}
                                required
                            />
                            <InputField
                                icon={<Mail size={18} />}
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={setEmail}
                                required
                            />
                            <div className="relative">
                                <InputField
                                    icon={<Lock size={18} />}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password (min 6 characters)"
                                    value={password}
                                    onChange={setPassword}
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-ivory-muted hover:text-brand-ivory transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <div className="relative">
                                <InputField
                                    icon={<Lock size={18} />}
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm password"
                                    value={confirmPassword}
                                    onChange={setConfirmPassword}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-ivory-muted hover:text-brand-ivory transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>

                            <SubmitButton isSubmitting={isSubmitting} label="Create Account" />
                        </form>

                        <div className="mt-8 text-center">
                            <span className="text-brand-ivory-muted text-sm">
                                Already have an account?{" "}
                            </span>
                            <button
                                onClick={() => switchView("sign-in")}
                                className="text-brand-gold text-sm font-medium hover:text-brand-gold/80 transition-colors"
                            >
                                Sign in
                            </button>
                        </div>
                    </motion.div>
                );

            case "forgot-password":
                return (
                    <motion.div
                        key="forgot-password"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <button
                            onClick={() => switchView("sign-in")}
                            className="flex items-center gap-2 text-brand-ivory-muted hover:text-brand-ivory transition-colors text-sm mb-6"
                        >
                            <ArrowLeft size={16} />
                            Back to sign in
                        </button>

                        <div className="text-center mb-8">
                            <h2 
                                className="mb-2"
                                style={{
                                    fontFamily: "var(--font-display)",
                                    fontSize: "var(--display-sm)",
                                    letterSpacing: "var(--tracking-display-sm)",
                                    color: "var(--text)"
                                }}
                            >
                                RESET PASSWORD
                            </h2>
                            <p style={{ color: "var(--text-muted)", fontSize: "var(--body)" }}>
                                Enter your email and we&apos;ll send you a reset link
                            </p>
                        </div>

                        {error && <ErrorMessage message={error} />}

                        <form onSubmit={handleForgotPassword} className="space-y-5">
                            <InputField
                                icon={<Mail size={18} />}
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={setEmail}
                                required
                            />
                            <SubmitButton isSubmitting={isSubmitting} label="Send Reset Link" />
                        </form>
                    </motion.div>
                );

            case "check-email":
                return (
                    <motion.div
                        key="check-email"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="text-center py-4"
                    >
                        <div className="w-16 h-16 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-brand-gold/20">
                            <Mail size={28} className="text-brand-gold" />
                        </div>
                        <h2 
                            className="mb-3"
                            style={{
                                fontFamily: "var(--font-display)",
                                fontSize: "var(--display-sm)",
                                letterSpacing: "var(--tracking-display-sm)",
                                color: "var(--text)"
                            }}
                        >
                            CHECK YOUR EMAIL
                        </h2>
                        <p className="text-brand-ivory-muted text-sm mb-8 leading-relaxed">
                            We&apos;ve sent a password reset link to<br />
                            <span className="text-brand-ivory font-medium">{email}</span>
                        </p>
                        <button
                            onClick={() => switchView("sign-in")}
                            className="text-brand-gold text-sm font-medium hover:text-brand-gold/80 transition-colors"
                        >
                            Back to sign in
                        </button>
                    </motion.div>
                );

            case "confirmation-sent":
                return (
                    <motion.div
                        key="confirmation-sent"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="text-center py-4"
                    >
                        <div className="w-16 h-16 bg-brand-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-brand-gold/20">
                            <Check size={28} className="text-brand-gold" />
                        </div>
                        <h2 
                            className="mb-3"
                            style={{
                                fontFamily: "var(--font-display)",
                                fontSize: "var(--display-sm)",
                                letterSpacing: "var(--tracking-display-sm)",
                                color: "var(--text)"
                            }}
                        >
                            VERIFY YOUR EMAIL
                        </h2>
                        <p className="text-brand-ivory-muted text-sm mb-4 leading-relaxed">
                            We&apos;ve sent a confirmation link to<br />
                            <span className="text-brand-ivory font-medium">{email}</span>
                        </p>
                        <p className="text-brand-ivory-muted text-xs mb-8 leading-relaxed">
                            Click the link in the email to activate your account, then come back and sign in.
                        </p>
                        <button
                            onClick={() => {
                                resetForm();
                                switchView("sign-in");
                            }}
                            className="crystal-glass-highlight crystal-glass px-8 py-3 rounded-xl text-brand-gold text-sm font-semibold tracking-wide hover:brightness-125 transition-all"
                        >
                            Go to Sign In
                        </button>
                    </motion.div>
                );
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="crystal-glass p-6 md:p-8 rounded-3xl w-full max-w-md relative overflow-y-auto overflow-x-hidden max-h-[95vh]"
                        style={{ willChange: "transform, opacity" }}
                    >
                        {/* Glow effect */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-32 bg-brand-gold/8 blur-[80px] rounded-full pointer-events-none" />

                        {/* Close button */}
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 z-[60] p-3 text-brand-ivory-muted hover:text-brand-ivory transition-colors rounded-full hover:bg-white/5 cursor-pointer"
                        >
                            <X size={20} />
                        </button>

                        {/* Brand mark */}
                        <div className="text-center mb-6 relative z-10">
                            <div className="flex justify-center items-center">
                                <span className="logo-text text-3xl md:text-4xl font-bold">
                                    MAKULAYO<span className="text-[0.35em] font-normal tracking-normal relative -top-[1.5em] ml-[-0.4em]">™</span>
                                </span>
                            </div>
                        </div>

                        <div className="relative z-10">
                            <AnimatePresence mode="wait">
                                {renderView()}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Reusable Input Field
function InputField({
    icon,
    type,
    placeholder,
    value,
    onChange,
    required,
    minLength,
}: {
    icon: React.ReactNode;
    type: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
    minLength?: number;
}) {
    return (
        <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-ivory-muted/60">
                {icon}
            </span>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required={required}
                minLength={minLength}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-12 py-3.5 text-brand-ivory placeholder:text-white/20 focus:outline-none focus:border-brand-gold/40 transition-colors text-sm"
            />
        </div>
    );
}

// Reusable Submit Button
function SubmitButton({ isSubmitting, label }: { isSubmitting: boolean; label: string }) {
    return (
        <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-xl crystal-glass-highlight crystal-glass text-brand-gold font-semibold tracking-wide hover:brightness-125 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
            {isSubmitting ? (
                <>
                    <div className="w-4 h-4 border-2 border-brand-gold/30 border-t-brand-gold rounded-full animate-spin" />
                    <span>Please wait...</span>
                </>
            ) : (
                label
            )}
        </button>
    );
}

// Reusable Error Message
function ErrorMessage({ message }: { message: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-5"
        >
            <AlertCircle size={16} className="text-red-400 shrink-0" />
            <p className="text-red-300 text-xs">{message}</p>
        </motion.div>
    );
}
