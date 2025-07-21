import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-900 dark:bg-neutral-950 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="text-2xl font-bold mb-2 text-accent-500">Thank You!</div>
          <p className="text-neutral-400">
            Thank you for choosing HG Bites. Visit again for more delicious food!
          </p>
          <p className="text-sm text-neutral-500 mt-4">
            © 2024 HG Bites. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;