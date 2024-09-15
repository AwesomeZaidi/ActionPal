"use client";

import { apiClient } from "@shared/lib/api-client";
import { useState } from "react";

export default function CtaPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [isCompleted, setIsCompleted] = useState(false);

  const handleComplete = () => {
    setIsCompleted(true);
  };

  // Fetch the CTA data only if `id` is available
  const { data, error, isLoading } = apiClient.cta.getCtaById.useQuery(id, {
    enabled: !!id, // Only enable the query if `id` is truthy
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading CTA: {error.message}</div>;
  }

  if (!data) {
    return <div>No CTA found</div>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-red-500 p-6">
      <h1 className="mb-2 text-4xl font-bold text-pink-200">JUNE 25</h1>
      <h2 className="mb-6 text-5xl font-bold text-white">CALL FOR CEASEFIRE</h2>

      <div className="relative mb-4 h-8 overflow-hidden bg-red-600">
        <div
          className="absolute left-0 top-0 h-full bg-white"
          style={{
            width: "34.6%",
            transform: "skew(-20deg)",
            transformOrigin: "top left",
          }}
        />
      </div>

      <div className="mb-6 flex justify-between text-white">
        <span>18 / 52 People Acted</span>
        <span className="flex items-center">
          <span className="mr-2">&lt; 3 mins</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
          <span className="ml-1">342</span>
        </span>
      </div>

      <div className="mb-auto rounded-3xl bg-white bg-opacity-20 p-6 backdrop-blur-lg">
        <h3 className="mb-4 text-2xl font-bold text-white">
          Call 702-426-9012
        </h3>
        <h4 className="mb-2 text-xl font-semibold text-white">Script</h4>
        <p className="text-white">
          My name is ____ and I'm calling about Palestine and Israel. The
          senator must take immediate steps to deescalate, by calling for 1) a
          total and permanent ceasefire, 2) humanitarian aid allowed to enter
          through Gaza, including reinstating funding to UNRWA, 3) an end to
          Israel's siege on Gaza, and 4) no more weapons or ...
        </p>
      </div>

      {/* <h2 className="mb-4 mt-6 text-4xl font-bold text-pink-200">JOIN US</h2> */}

      <button
        className={`fixed bottom-0 left-0 right-0 py-4 text-center text-xl font-bold ${
          isCompleted ? "bg-green-500" : "bg-green-600"
        } text-white`}
        onClick={handleComplete}
        // whileTap={{ scale: 0.95 }}
      >
        {isCompleted ? "COMPLETED" : "TAP ONCE COMPLETED"}
      </button>
    </div>
  );
}
