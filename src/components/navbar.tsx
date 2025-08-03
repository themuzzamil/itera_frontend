import Link from "next/link"

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/85 backdrop-blur-md border-b border-gray-200 shadow-md">
      <div className="mx-auto px-4 md:px-16 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/Cynosureicon.webp" 
                alt="IteraAI Logo" 
                width={36} 
                height={36} 
                className="text-white"
              />
            </div>
            <div>
              <span className="text-xl font-bold text-primary">IteraAI</span>
              <p className="text-xs text-gray-600">by Cynosure International</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/cv-parsing" className="text-gray-700 hover:text-primary transition-colors">
              CV Parsing
            </Link>
            <Link href="/europass-formatting" className="text-gray-700 hover:text-primary transition-colors">
              Europass Formatting
            </Link>
            <Link href="/expert-profile" className="text-gray-700 hover:text-primary transition-colors">
              Expert Profile
            </Link>
            <Link href="/tender-matching" className="text-gray-700 hover:text-primary transition-colors">
              Tender Matching
            </Link>
            {/* <Button className="bg-primary hover:bg-primary-600 text-white font-semibold">Get Started</Button> */}
          </div>
        </div>
      </div>
    </nav>
  )
}
