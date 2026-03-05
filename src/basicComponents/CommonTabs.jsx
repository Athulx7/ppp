import React from 'react';

function CommonTabs({ tabs, activeTab, onTabChange, className = '' }) {
    return (
        <div className={`border-b border-gray-200 ${className}`}>
            <nav className="flex -mb-px space-x-8 overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`
                            group inline-flex items-center px-1 py-4 border-b-2 font-medium text-sm whitespace-nowrap
                            ${activeTab === tab.id
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }
                        `}
                    >
                        {tab.icon && <span className="mr-2">{tab.icon}</span>}
                        {tab.label}
                        {tab.count !== undefined && (
                            <span className={`
                                ml-2 py-0.5 px-2 rounded-full text-xs
                                ${activeTab === tab.id
                                    ? 'bg-indigo-100 text-indigo-600'
                                    : 'bg-gray-100 text-gray-600'
                                }
                            `}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </nav>
        </div>
    );
}

export default CommonTabs;