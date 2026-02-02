import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Home, AlertCircle, ArrowLeft } from 'lucide-react';

function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
            <div className="max-w-2xl w-full text-center">
                <div className="relative mb-8">
                    <div className="text-[180px] md:text-[240px] font-bold text-gray-800 opacity-10">
                        404
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center p-4 bg-red-100 rounded-full mb-4">
                                <AlertCircle className="w-16 h-16 text-red-600" />
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                                Page Not Found
                            </h1>
                            <p className="text-gray-600 text-lg">
                                Oops! The page you're looking for doesn't exist.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Go Back
                    </button>
                </div>

            </div>
        </div>
    );
}

export default NotFoundPage
