import { ChevronRight, LayoutDashboard } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

function BreadCrumb({ headerName, buttonContent,subcontent }) {
    return (
        <>
            <div className="flex items-center text-sm text-gray-600 mb-3">
                <Link to="/" className="flex items-center hover:underline">
                    <LayoutDashboard className="w-4 h-4 mr-2 text-gray-400" />
                    Dashboard
                </Link>

                <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />

                <span className="font-medium text-indigo-600">
                    {headerName}
                </span>
            </div>

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {headerName}
                    </h1>
                    <p className="text-gray-600 text-sm">
                        {subcontent}
                    </p>
                </div>
                { buttonContent ? <>{buttonContent}</>:null}
            </div>

        </>
    )
}

export default BreadCrumb