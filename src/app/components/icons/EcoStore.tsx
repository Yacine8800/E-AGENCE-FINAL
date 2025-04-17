import React from "react";

export default function Ecostore({ className = "" }: { className?: string }) {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        opacity="0.3"
        d="M5.875 9.375L5.25 12.5H19.75L19.125 9.375H5.875Z"
        fill="#56C1B5"
      />
      <path
        d="M4.16667 4.16675H20.8333V6.25008H4.16667V4.16675ZM20.8333 7.29175H4.16667L3.125 12.5001V14.5834H4.16667V20.8334H14.5833V14.5834H18.75V20.8334H20.8333V14.5834H21.875V12.5001L20.8333 7.29175ZM12.5 18.7501H6.25V14.5834H12.5V18.7501ZM5.25 12.5001L5.875 9.37508H19.125L19.75 12.5001H5.25Z"
        fill="#56C1B5"
      />
    </svg>
  );
}
