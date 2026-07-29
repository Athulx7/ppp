import { AlertCircle, Lock, Play, RefreshCw, Trash2 } from "lucide-react"

function QuerryEditor({ handleExecute, query, handleClear, setQuery, password, setPassword, isLoading, error }) {
    return (
        <>
            <div className="lg:col-span-3 bg-white rounded-md border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                <form onSubmit={handleExecute} className="p-5 flex flex-col flex-grow space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center justify-between">
                            <span>SQL Query Editor</span>
                            {query && (
                                <button
                                    type="button"
                                    onClick={handleClear}
                                    className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 font-medium transition"
                                >
                                    <Trash2 className="w-3.5 h-3.5" /> Clear Editor
                                </button>
                            )}
                        </label>

                        <div className="relative rounded-md border border-gray-300 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 overflow-hidden">
                            <textarea
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="SELECT * FROM tbl_employee_mst WHERE is_active = 1..."
                                rows="8"
                                className="w-full border-0 p-4 font-mono text-sm bg-gray-950 text-emerald-400 placeholder-gray-600 focus:ring-0 focus:outline-none resize-y"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-2">
                        <div className="w-full md:max-w-xs">
                            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                                <Lock className="w-3.5 h-3.5 text-gray-500" />
                                Verify Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter login password"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                required
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="inline-flex items-center justify-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md cursor-pointer text-sm font-semibold transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                        Executing...
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-4 h-4 fill-current" />
                                        Execute Query
                                    </>
                                )}
                            </button>
                            <button onClick={handleClear}
                                className="h-8 w-8 mt-1 flex cursor-pointer items-center justify-center border bg-gray-200 border-gray-400 rounded-md hover:border-gray-400 text-gray-700"
                            >
                                <RefreshCw className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </form>

                {error && (
                    <div className="bg-red-50 border-t border-red-200 px-5 py-4 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <div>
                            <h4 className="text-sm font-semibold text-red-800">Execution Blocked / Query Error</h4>
                            <p className="text-xs text-red-700 mt-1 font-mono">{error}</p>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default QuerryEditor