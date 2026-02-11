import { ChevronRight, LayoutDashboard } from "lucide-react"
import React from "react"
import { Link } from "react-router-dom"

function Breadcrumb({ items = [], title, description, actions }) {
    return (
        <>
            <div className="flex items-center text-sm mb-3">

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
            </div>

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {title}
                    </h1>

                    {description && (
                        <p className="text-gray-600 text-sm">
                            {description}
                        </p>
                    )}
                </div>

                {actions && <div>{actions}</div>}
            </div>

        </>
    )
}

export default Breadcrumb