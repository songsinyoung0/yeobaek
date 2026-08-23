import React from 'react';

interface KakaoIconProps {
  className?: string;
}

export const KakaoIcon: React.FC<KakaoIconProps> = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 3C6.477 3 2 6.477 2 10.765c0 2.75 1.83 5.163 4.608 6.544l-1.173 4.316c-.104.382.327.696.657.478l5.122-3.385c.258.026.521.047.786.047 5.523 0 10-3.477 10-7.765C22 6.477 17.523 3 12 3z" />
  </svg>
);
