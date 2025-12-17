"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./LanguageSwitcher.module.css";

const LANGUAGES = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "ht", name: "Kreyòl Ayisyen", flag: "🇭🇹" },
    { code: "es-do", name: "Español (Dominicano)", flag: "🇩🇴" },
    { code: "es-pr", name: "Español (Puertorriqueño)", flag: "🇵🇷" },
    { code: "es-mx", name: "Español (Mexicano)", flag: "🇲🇽" },
    { code: "es-cu", name: "Español (Cubano)", flag: "🇨🇺" },
    { code: "es-sv", name: "Español (Salvadoreño)", flag: "🇸🇻" },
    { code: "es-gt", name: "Español (Guatemalteco)", flag: "🇬🇹" },
    { code: "es-hn", name: "Español (Hondureño)", flag: "🇭🇳" },
    { code: "es-co", name: "Español (Colombiano)", flag: "🇨🇴" },
    { code: "es-ve", name: "Español (Venezolano)", flag: "🇻🇪" },
    { code: "es-pe", name: "Español (Peruano)", flag: "🇵🇪" },
    { code: "es-ec", name: "Español (Ecuatoriano)", flag: "🇪🇨" },
    { code: "es-ar", name: "Español (Argentino)", flag: "🇦🇷" },
    { code: "es-cl", name: "Español (Chileno)", flag: "🇨🇱" },
    { code: "es-bo", name: "Español (Boliviano)", flag: "🇧🇴" },
    { code: "es-py", name: "Español (Paraguayo)", flag: "🇵🇾" },
    { code: "es-uy", name: "Español (Uruguayo)", flag: "🇺🇾" },
];

export function LanguageSwitcher() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
    const containerRef = useRef<HTMLDivElement>(null);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem("finova-lang");
        if (saved) {
            const found = LANGUAGES.find((l) => l.code === saved);
            if (found) setSelectedLang(found);
        }
    }, []);

    // Save to localStorage and potentially trigger translation logic here
    const handleSelect = (lang: typeof LANGUAGES[0]) => {
        setSelectedLang(lang);
        localStorage.setItem("finova-lang", lang.code);
        setIsOpen(false);

        // Simulate page "translation" fade effect if full i18n isn't ready
        document.body.style.opacity = "0.5";
        setTimeout(() => {
            document.body.style.opacity = "1";
        }, 300);
    };

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className={styles.container} ref={containerRef}>
            <button
                className={cn(styles.trigger, isOpen && styles.active)}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Select Language"
            >
                <Globe size={16} className={styles.iconGlobe} />
                <span className={styles.currentLabel}>{selectedLang.name}</span>
                <span className={styles.flag}>{selectedLang.flag}</span>
                <ChevronDown size={14} className={cn(styles.iconChevron, isOpen && styles.rotate)} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={styles.dropdown}
                    >
                        <div className={styles.scrollArea}>
                            {LANGUAGES.map((lang) => (
                                <button
                                    key={lang.code}
                                    className={cn(styles.option, selectedLang.code === lang.code && styles.selected)}
                                    onClick={() => handleSelect(lang)}
                                >
                                    <span className={styles.optionFlag}>{lang.flag}</span>
                                    <span className={styles.optionName}>{lang.name}</span>
                                    {selectedLang.code === lang.code && <Check size={14} className={styles.check} />}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
