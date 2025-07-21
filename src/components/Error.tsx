import React from 'react'

const ErrorPage = () => {
  return (
    <div className="flex h-[80vh] flex-col items-center justify-center p-6 space-y-4 text-red-600">
      <svg
        className="w-12 h-12 animate-spin text-red-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
      </svg>
      <p className="text-lg font-semibold">❌ Failed to load products.</p>
      <p className="text-center text-sm text-red-400">
        Please check your internet connection or try again later.
      </p>
    </div>
  );
}

export default ErrorPage;