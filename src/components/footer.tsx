import { Brain } from "lucide-react"

export function Footer() {
  return (
    <footer className="py-12 bg-gray-900 text-white">
      <div className="mx-auto px-4 md:px-16">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <img src="/Cynosurelogo.webp" alt="Logo" className="h-8 w-auto" />
          </div>
          <div className="text-center md:text-right text-gray-400">
            <p>© 2025 Cynosure International. All rights reserved.</p>
            <p className="text-xs md:text-sm mt-1">Woman-founded, Women-led • International Development Consulting</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
