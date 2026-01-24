import React, { useState, useEffect } from "react"
import './basicCss/comCss.css'
function CommonTable({ columns, data, tableControls, customHeader }) {
    const [searchTerm, setSearchTerm] = useState("")
    const [entriesPerPage, setEntriesPerPage] = useState(10)
    const [currentPage, setCurrentPage] = useState(1)
    const [filteredData, setFilteredData] = useState(data)

    useEffect(() => {
        const term = searchTerm.toLowerCase();
        const filtered = data.filter((row) =>
            Object.values(row).some((val) =>
                String(val).toLowerCase().includes(term)
            )
        )
        setFilteredData(filtered)
        setCurrentPage(1)
    }, [searchTerm, data])

    const startIndex = (currentPage - 1) * entriesPerPage
    const endIndex = startIndex + entriesPerPage
    const currentData = filteredData.slice(startIndex, endIndex)
    const totalPages = Math.ceil(filteredData.length / entriesPerPage)

    return (
        <div className="my-6 border bg-white border-gray-200 shadow-lg rounded-lg overflow-hidden">
            {customHeader && (
                <div className="p-2 border-b border-gray-200">
                    {customHeader}
                </div>
            )}
            <div className="flex flex-wrap justify-between items-center gap-4 p-4">
                <div className="flex items-center gap-2">
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
                </div>

                <div className="flex gap-2 items-center">
                    {tableControls && tableControls}
                    <input
                        type="text"
                        placeholder="Search Anything"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-gray-700"
                    />
                </div>
            </div>

            <div className="overflow-auto max-h-[60vh] scrollbar">
                <table className="min-w-full table-fixed border-collapse">
                    <thead className="bg-gray-100">
                        <tr>
                            {columns.map((col, i) => (
                                <th
                                    key={i}
                                    className="px-4 py-2 sticky top-0 text-left text-black border-2 border-gray-200 font-medium whitespace-nowrap"
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.length === 0 ? (
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
                                        <td key={ci} className="px-4 py-3 border-b border-gray-200 whitespace-nowrap">
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

            <div className="flex flex-wrap justify-between items-center p-4 bg-white text-sm text-gray-700">
                <div>
                    Showing{" "}
                    {filteredData.length === 0 ? 0 : startIndex + 1} to{" "}
                    {endIndex > filteredData.length
                        ? filteredData.length
                        : endIndex}{" "}
                    of {filteredData.length} entries
                </div>
                <div className="flex gap-2 items-center mt-2 sm:mt-0">
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
                </div>
            </div>

        </div>
    )
}

export default CommonTable