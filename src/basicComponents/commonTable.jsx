import React, { useState, useEffect } from "react"
import './basicCss/comCss.css'
function CommonTable({ columns, data, tableControls, customHeader, customClass, loading = false }) {
    const [searchTerm, setSearchTerm] = useState("")
    const [entriesPerPage, setEntriesPerPage] = useState(10)
    const [currentPage, setCurrentPage] = useState(1)
    const [filteredData, setFilteredData] = useState(data)
    const skeletonCount = data?.length > 0 ? data.length : entriesPerPage;

    useEffect(() => {
        if (loading) return;

        const term = searchTerm.toLowerCase();
        const filtered = data.filter((row) =>
            Object.values(row).some((val) =>
                String(val).toLowerCase().includes(term)
            )
        )
        setFilteredData(filtered)
        setCurrentPage(1)
    }, [searchTerm, data, loading])

    const startIndex = (currentPage - 1) * entriesPerPage
    const endIndex = startIndex + entriesPerPage
    const currentData = filteredData.slice(startIndex, endIndex)
    const totalPages = Math.ceil(filteredData.length / entriesPerPage)

    return (
        <div className={`border bg-white border-gray-200 shadow-lg rounded-lg overflow-hidden ${customClass || "my-6"} `}>
            {customHeader && (
                <div className="p-2 border-b border-gray-200">
                    {customHeader}
                </div>
            )}
            <div className="flex flex-wrap justify-between items-center gap-4 p-2">
                <div className="flex items-center gap-2">
                    {loading ? (
                        <div className="flex items-center gap-2 animate-pulse">
                            <div className="h-4 w-10 bg-gray-200 rounded"></div>
                            <div className="h-8 w-16 bg-gray-200 rounded"></div>
                            <div className="h-4 w-14 bg-gray-200 rounded"></div>
                        </div>
                    ) : (
                        <>
                            <label className="text-sm text-gray-700">Show</label>
                            <select
                                value={entriesPerPage}
                                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                                className="border border-gray-300 px-2 py-1 rounded text-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            >
                                {[10, 25, 50, 100].map((num) => (
                                    <option key={num} value={num}>
                                        {num}
                                    </option>
                                ))}
                            </select>
                            <span className="text-sm text-gray-700">entries</span>
                        </>
                    )}
                </div>

                <div className="flex gap-2 items-center">
                    {loading ? (
                        <div className="flex gap-2 items-center animate-pulse">
                            {tableControls && (
                                <div className="h-8 w-24 bg-gray-200 rounded"></div>
                            )}

                            <div className="h-8 w-40 bg-gray-200 rounded"></div>
                        </div>
                    ) : (
                        <>
                            {tableControls && tableControls}

                            <input
                                type="text"
                                placeholder="Search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="p-1 border border-gray-300 rounded shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-gray-700"
                            />
                        </>
                    )}
                </div>
            </div>

            <div className="overflow-auto max-h-[60vh] scrollbar">
                <table className="min-w-full table-fixed border-collapse">
                    <thead className="bg-gray-100">
                        <tr>
                            {loading
                                ? columns.map((_, i) => (
                                    <th
                                        key={i}
                                        className="px-2 py-2 border-2 border-gray-200"
                                    >
                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                                    </th>
                                ))
                                : columns.map((col, i) => (
                                    <th
                                        key={i}
                                        className="px-2 py-2 sticky top-0 text-left text-black border-2 border-gray-200 font-medium whitespace-nowrap"
                                    >
                                        {col.header}
                                    </th>
                                ))
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            [...Array(skeletonCount)].map((_, ri) => (
                                <tr key={ri} className="animate-pulse">
                                    {columns.map((_, ci) => (
                                        <td key={ci} className="px-2 py-2 border-b border-gray-200">
                                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : currentData.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="text-center py-4 text-gray-500"
                                >
                                    No data available
                                </td>
                            </tr>
                        ) : (
                            currentData.map((row, ri) => (
                                <tr
                                    key={ri}
                                    className={`text-sm text-gray-700 ${ri % 2 === 0 ? 'bg-white' : 'bg-indigo-50'}`}
                                >
                                    {columns.map((col, ci) => (
                                        <td key={ci} className="px-2 py-2 border-b border-gray-200 whitespace-nowrap">
                                            {col.cell
                                                ? col.cell(row)
                                                : col.accessor
                                                    ? row[col.accessor]
                                                    : null}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-wrap justify-between items-center p-2 bg-white text-sm text-gray-700">
                <div>
                    {loading ? (
                        <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
                    ) : (
                        <>
                            Showing{" "}
                            {filteredData.length === 0 ? 0 : startIndex + 1} to{" "}
                            {endIndex > filteredData.length
                                ? filteredData.length
                                : endIndex}{" "}
                            of {filteredData.length} entries
                        </>
                    )}
                </div>
                <div className="flex gap-2 items-center mt-2 sm:mt-0">
                    {loading ? (
                        <>
                            <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 hover:bg-indigo-500 hover:text-white transition-colors"
                            >
                                Prev
                            </button>

                            <span className="px-3 py-1 bg-indigo-500 text-white rounded">
                                {currentPage}
                            </span>

                            <button
                                onClick={() =>
                                    setCurrentPage((p) => (p < totalPages ? p + 1 : p))
                                }
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 hover:bg-indigo-500 hover:text-white transition-colors"
                            >
                                Next
                            </button>
                        </>
                    )}
                </div>
            </div>

        </div>
    )
}

export default CommonTable