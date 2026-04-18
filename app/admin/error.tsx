"use client";

import { useEffect } from "react";
import { AlertTriangle, ServerCrash, RefreshCcw } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin section error:", error);
  }, [error]);

  const isDatabaseError = error.message.includes("PrismaClientInitializationError") || 
                          error.message.includes("Can't reach database server") ||
                          error.message.includes("fetch failed");

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-8 text-center border border-red-100">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          {isDatabaseError ? (
            <ServerCrash className="text-red-500 w-10 h-10" />
          ) : (
            <AlertTriangle className="text-red-500 w-10 h-10" />
          )}
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {isDatabaseError ? "Database Connection Failed" : "Something went wrong!"}
        </h2>
        
        <div className="bg-red-50 text-red-700 text-sm p-4 rounded-xl mb-6 mt-4 text-left overflow-auto max-h-48 border border-red-100">
          <p className="font-semibold mb-1">Error details:</p>
          <code className="text-xs break-words">{error.message}</code>
        </div>
        
        {isDatabaseError && (
          <p className="text-gray-600 text-sm mb-8">
            Your local MySQL database is currently unreachable. Please make sure that your database service is running on <strong>localhost:3306</strong> and that you have run <code>npx prisma db seed</code>.
          </p>
        )}

        <button
          onClick={() => reset()}
          className="bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 w-full"
        >
          <RefreshCcw size={18} />
          Try Again
        </button>
      </div>
    </div>
  );
}
