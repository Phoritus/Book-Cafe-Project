import React from "react";
import { MapPin, Clock, Phone } from "lucide-react";
import logo from "../assets/mail.svg";

const Footer = () => {
  return (
    <footer className="bg-[#86422A] text-white py-6">
      <div className="max-w-7xl h-[150px] mx-auto px-4 sm:px-6 lg:px-8 flex justify-between">
        
        {/* Column 1: Book Café */}
        <div className="flex flex-col space-y-2 leading-relaxed">
          <h3 className="text-base font-semibold mb-1">Book Café</h3>
          <p className="text-sm">Where literature meets comfort</p>
          <p className="text-sm text-white/50 ">Made with for book lovers</p>
          <p className="text-xs mt-1  text-white/50">© 2025 Book Café. All rights reserved.</p>
        </div>

        {/* Column 2: Visit Us */}
        <div className="flex flex-col space-y-2 leading-relaxed">
          <h3 className="text-base font-semibold mb-1">Visit Us</h3>
          <p className="flex items-center text-sm gap-x-3">
            <MapPin className="w-4 h-4" />
            Location :
            123 Writers' Alley, Fiction Street, Imaginaria District, Bangkok 10110
          </p>
          <p className="flex items-center text-sm gap-x-3">
            <Clock className="w-4 h-4" />
            Opening Hours : 08:00 - 19:00 (Daily)
          </p>
        </div>

        {/* Column 3: Contact Info */}
        <div className="flex flex-col space-y-2 leading-relaxed">
          <h3 className="text-base font-semibold mb-1">Contact info</h3>
          <p className="flex items-center text-sm gap-x-3">
            <Phone className="w-4 h-4" />
            Tel : 020 - 123 - 4567
          </p>
          <p className="flex items-center text-sm gap-x-3">
            <img src={logo} alt="Mail" className="w-4 h-4" />
            Email : contact@bookcafe.com
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
