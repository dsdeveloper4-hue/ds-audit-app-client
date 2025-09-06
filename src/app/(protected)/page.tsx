"use client";
export default function Home() {
  return (
    <>
      <div className="flex flex-col justify-center items-center fixed top-0 left-0 right-0 bottom-0 bg-gradient-to-br from-blue-50 via-white to-blue-100 text-center px-4">
        <h1 className="text-4xl sm:text-5xl font-bold text-blue-800 mb-4">
          Hey, welcome to <span className="text-blue-600">Digital Seba</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-xl">
          We&lsquo;re glad to have you here. Explore our services and discover
          how we can help your digital journey.
        </p>
      </div>
    </>
  );
}
