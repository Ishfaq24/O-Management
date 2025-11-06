const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-r bg-emerald-700 text-white mt-16">
      {/* Wave Top */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] rotate-180">
        <svg
          className="relative block w-full h-12"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0V46.29c47.29,22.39,104.73,29.14,158,12C250.34,38.6,314,0,376,0s125.66,38.6,197.84,58.28c69.87,19.26,139.61,18.57,209.76-1.09C875.34,36,945.61,0,1016,0s125.66,36,184,46.29V0Z"
            fill="white"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* About Section */}
          <div>
            <h3 className="text-2xl font-bold mb-3">HackHub_24</h3>
            <p className="text-gray-100 leading-relaxed">
              Empowering developers with resources, projects, and community events.
              Join us and take your coding skills to the next level!
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-2xl font-bold mb-3">Quick Links</h3>
            <ul>
              <li className="hover:text-green-200 transition cursor-pointer my-1">Dashboard</li>
              <li className="hover:text-green-200 transition cursor-pointer my-1">Employees</li>
              <li className="hover:text-green-200 transition cursor-pointer my-1">Projects</li>
              <li className="hover:text-green-200 transition cursor-pointer my-1">Products</li>
            </ul>
          </div>
          
          {/* Contact / Socials */}
          <div>
            <h3 className="text-2xl font-bold mb-3">Connect With Us</h3>
            <p>Email: <span className="text-gray-100">contact@hackhub24.com</span></p>
            <div className="flex space-x-4 mt-3 text-xl">
              <a href="#" className="hover:text-green-200 transition transform hover:scale-110">🌐</a>
              <a href="#" className="hover:text-green-200 transition transform hover:scale-110">🐦</a>
              <a href="#" className="hover:text-green-200 transition transform hover:scale-110">💼</a>
              <a href="#" className="hover:text-green-200 transition transform hover:scale-110">📘</a>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-16 border-t border-green-400 pt-4 text-center text-gray-200 text-sm">
          &copy; {new Date().getFullYear()} HackHub_24. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
