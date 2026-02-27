import { ChevronRight, LayoutDashboard } from "lucide-react"
import React from "react"
import { Link } from "react-router-dom"

function Breadcrumb({ items = [], title, description, actions, loading = false }) {
    return (
        <>
            <div className="flex items-center text-sm mb-3">
                {loading ? (
                    <div className="flex items-center gap-2 animate-pulse">
                        <div className="h-4 w-20 bg-gray-200 rounded"></div>
                        <div className="h-4 w-4 bg-gray-200 rounded"></div>
                        <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    </div>
                ) : (
                    <>
                        <Link
                            to="/"
                            className="flex items-center text-indigo-600 hover:underline font-medium"
                        >
                            <LayoutDashboard className="w-4 h-4 mr-1" />
                            Dashboard
                        </Link>

                        {items.map((item, index) => (
                            <React.Fragment key={index}>
                                <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />

                                {item.to ? (
                                    <Link
                                        to={item.to}
                                        className="text-gray-600 hover:underline"
                                    >
                                        {item.label}
                                    </Link>
                                ) : (
                                    <span className="font-medium text-gray-800">
                                        {item.label}
                                    </span>
                                )}
                            </React.Fragment>
                        ))}
                    </>
                )}
            </div>

            <div className="flex justify-between items-center mb-6">
                <div>
                    {loading ? (
                        <div className="animate-pulse space-y-2">
                            <div className="h-6 w-48 bg-gray-200 rounded"></div>
                            <div className="h-4 w-64 bg-gray-200 rounded"></div>
                        </div>
                    ) : (
                        <>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {title}
                            </h1>

                            {description && (
                                <p className="text-gray-600 text-sm">
                                    {description}
                                </p>
                            )}
                        </>
                    )}
                </div>

                {!loading && actions && <div>{actions}</div>}
            </div>
        </>
    )
}

export default Breadcrumb