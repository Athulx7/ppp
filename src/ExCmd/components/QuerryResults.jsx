import { CheckCircle2, FileJson, FileSpreadsheet } from "lucide-react"

function QuerryResults({ results, executionTime, searchTerm, setSearchTerm, downloadCSV, downloadJSON, filteredData }) {
    return (
        <>
            <div className="bg-white rounded-md border border-gray-200 shadow-sm overflow-hidden space-y-4 p-5 mt-3">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-2 border-b border-gray-100">
                    <div className="space-y-1">
                        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-1.5">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            Query Results
                        </h2>
                        <p className="text-xs text-gray-500">
                            Fetched <span className="font-semibold text-gray-700">{results.data.length}</span> rows in <span className="font-semibold text-gray-700">{executionTime}ms</span>
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search in results..."
                            className="px-3 py-1.5 border border-gray-300 rounded-sm text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-48 transition"
                        />

                        <button
                            onClick={downloadCSV}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-md text-xs font-semibold transition"
                        >
                            <FileSpreadsheet className="w-3.5 h-3.5" />
                            Export CSV
                        </button>

                        <button
                            onClick={downloadJSON}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-md text-xs font-semibold transition"
                        >
                            <FileJson className="w-3.5 h-3.5" />
                            Export JSON
                        </button>
                    </div>
                </div>

                {filteredData.length > 0 ? (
                    <div className="overflow-x-auto scrollbar border border-gray-200 rounded-lg max-h-[500px]">
                        <table className="w-full text-left text-xs text-gray-600 border-collapse">
                            <thead className="bg-gray-50 text-gray-700 uppercase font-semibold sticky top-0 border-b border-gray-200">
                                <tr>
                                    {results.columns.map((col, index) => (
                                        <th key={index} className="px-4 py-3 border-r border-gray-200 font-mono tracking-wider min-w-[120px]">
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredData.map((row, rIdx) => (
                                    <tr key={rIdx} className="hover:bg-indigo-50/30 transition-colors odd:bg-white even:bg-gray-50/50">
                                        {results.columns.map((col, cIdx) => {
                                            const val = row[col];
                                            let stringVal = val === null || val === undefined ? 'NULL' : String(val);
                                            if (val instanceof Object && !(val instanceof Date)) {
                                                stringVal = JSON.stringify(val);
                                            }
                                            return (
                                                <td key={cIdx} className={`px-4 py-2.5 border-r border-gray-200 font-mono truncate max-w-xs ${val === null ? 'text-gray-400 italic' : ''}`} title={stringVal}>
                                                    {stringVal}
                                                </td>
                                            )
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-gray-500 text-sm">
                        No rows matching filters or query returned empty results.
                    </div>
                )}
            </div>
        </>
    )
}

export default QuerryResults