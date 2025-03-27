"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

interface MobileMenuProps {
  navItems: string[]
  currentPage: string
  setCurrentPage: (page: string) => void
}

export default function MobileMenu({ navItems, currentPage, setCurrentPage }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Close menu when page changes
  useEffect(() => {
    setIsOpen(false)
  }, [currentPage])

  // Close menu when screen size increases beyond mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        className="relative z-50"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 z-40"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-3/4 bg-white z-50 p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col space-y-6 pt-10">
                {navItems.map((item, index) => (
                  <a
                    key={index}
                    onClick={() => setCurrentPage(item.toLowerCase())}
                    className={`
                      text-lg font-medium cursor-pointer
                      ${currentPage === item.toLowerCase() ? "text-green-700 font-semibold" : "text-gray-600"}
                    `}
                  >
                    {item}
                  </a>
                ))}
                <Button onClick={() => setCurrentPage("quote")} className="bg-green-700 text-white w-full mt-4">
                  Get Free Quote
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

