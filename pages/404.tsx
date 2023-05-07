import React, { FC } from 'react';
import Link from 'next/link';

const Custom404: FC = () => {
  return (
    <div className="h-screen bg-gradient-to-br from-start-gradient to-end-gradient flex items-center justify-center">
      <div className="text-center text-2xl">
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for does not exist or has been moved.</p>
        <Link href="/">
          <p className="underline mt-10 text-2xl">Go back to the homepage</p>
        </Link>
      </div>
    </div>
  );
};

export default Custom404;
