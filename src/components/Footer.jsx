import React from "react";
import { Globe, Twitter, Linkedin, Github, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-emerald-950 text-emerald-100">
      {/* Soft Top Divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-3">
              HackHub<span className="text-emerald-400">_24</span>
            </h2>
            <p className="text-sm leading-relaxed text-emerald-200/80">
              HackHub empowers developers and startups with real-world
              projects, learning resources, and a strong tech community.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-sm font-semibold text-emerald-300 mb-4 uppercase tracking-wider">
              Platform
            </h3>
            <ul className="space-y-2 text-sm">
              {["Dashboard", "Projects", "Services", "AI Tutor"].map(
                (item) => (
                  <li
                    key={item}
                    className="hover:text-emerald-400 cursor-pointer transition"
                  >
                    {item}
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-emerald-300 mb-4 uppercase tracking-wider">
              Company
            </h3>
            <ul className="space-y-2 text-sm">
              {["About", "Community", "Careers", "Contact"].map(
                (item) => (
                  <li
                    key={item}
                    className="hover:text-emerald-400 cursor-pointer transition"
                  >
                    {item}
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-sm font-semibold text-emerald-300 mb-4 uppercase tracking-wider">
              Connect
            </h3>

            <div className="flex items-center gap-3 mb-4 text-sm">
              <Mail size={16} />
              <span>hackhub24.dev@gmail.com</span>
            </div>

            <div className="flex gap-3">
              {[Globe, Twitter, Linkedin, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-2 rounded-lg bg-emerald-900 hover:bg-emerald-800 hover:text-emerald-400 transition"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 pt-6 border-t border-emerald-900 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-emerald-300/80">
          <span>
            © {new Date().getFullYear()} HackHub_24. All rights reserved.
          </span>

          <div className="flex gap-4">
            <span className="hover:text-emerald-400 cursor-pointer transition">
              Privacy
            </span>
            <span className="hover:text-emerald-400 cursor-pointer transition">
              Terms
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
