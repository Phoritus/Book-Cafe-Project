import React from 'react';
import { MapPin, Clock, Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#7B4B3A] text-white py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Book Café</h3>
            <p className="text-sm mb-1">Where literature meets comfort</p>
            <p className="text-sm mb-1">Made with for book lovers</p>
            <p className="text-xs mt-2">© 2025 Book Café. All rights reserved.</p>
          </div>

          {/* Visit Us */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Visit Us</h3>
            <p className="flex items-center text-sm mb-1">
              <MapPin className="w-4 h-4 mr-2" /> 
              Location : 123 Writers' Alley, Fiction Street,Imaginaria District,Bangkok 10110
            </p>
            <p className="flex items-center text-sm">
              <Clock className="w-4 h-4 mr-2" /> 
              Opening Hours : 08:00 - 19:00 (Daily)
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Contact info</h3>
            <p className="flex items-center text-sm mb-1">
              <Phone className="w-4 h-4 mr-2" /> 
              Tel : 020 - 123 - 4567
            </p>
            <p className="flex items-center text-sm">
              <Mail className="w-4 h-4 mr-2" /> 
              Email : contact@bookcafe.com
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
