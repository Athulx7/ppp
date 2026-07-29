import React, { useEffect, useState } from "react"
import QuerryEditor from "./QuerryEditor"
import QuerryResults from "./QuerryResults"
import QuerryTemplates from "./QuerryTemplates"
import { ApiCall } from "../../library/constants"
import showStatusToast from "../../basicComponents/CommonStatusPopUp"
import LoadingSpinner from "../../basicComponents/LoadingSpinner"

function ExCmdMain({ isLoading, setIsLoading }) {
    const [isAuthorized, setIsAuthorized] = useState(null)
    const [query, setQuery] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [results, setResults] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [executionTime, setExecutionTime] = useState(null)

    const templates = [
        {
            label: "List Employees",
            sql: "SELECT TOP 50 emp_code, first_name, last_name, email, department_code, designation_code, is_active FROM tbl_employee_mst ORDER BY created_at DESC;"
        },
        {
            label: "List Departments",
            sql: "SELECT depart_code, depart_name, depart_description, is_active FROM tbl_department_mst;"
        },
        {
            label: "User Sign-in Status",
            sql: "SELECT TOP 50 emp_code, is_active, created_at, updated_at FROM tbl_user_info;"
        },
        {
            label: "Active Jobs Priority",
            sql: "SELECT priority_id, jprority_code, priority_name, level, is_active FROM tbl_job_priority;"
        }
    ];

    useEffect(() => {
        const userStr = sessionStorage.getItem('user')
        if (userStr) {
            try {
                const user = JSON.parse(userStr)
                if (user.role_code === 'ADMIN') {
                    setIsAuthorized(true)
                } else {
                    setIsAuthorized(false)
                }
            } catch (e) {
                setIsAuthorized(false)
            }
        } else {
            setIsAuthorized(false)
        }
    }, [])

    const handleExecute = async (e) => {
        e.preventDefault()
        if (!query.trim()) {
            setError("Please enter a SQL query.")
            return
        }
        if (!password) {
            setError("Please enter your current password for security verification.")
            return
        }

        setError('')
        setResults(null)
        setIsLoading(true)
        const startTime = performance.now()

        try {
            const response = await ApiCall('post', 'excmd/execute', { query: query, password: password })

            const endTime = performance.now()
            setExecutionTime(Math.round(endTime - startTime))

            if (response.data && response.data.success) {
                setResults(response.data)
                showStatusToast("Query executed successfully", "success")
                setPassword('')
            } else {
                setError(response.data.message || "Failed to execute query.")
                showStatusToast(response.data.message || "Execution failed", "error")
            }
        } catch (err) {
            const errorMsg = err.data?.message || err.message || "An unexpected error occurred during execution."
            setError(errorMsg)
            showStatusToast("Execution failed", "error")
        } finally {
            setIsLoading(false)
        }
    }

    const handleTemplateClick = (sql) => {
        setQuery(sql)
        setError('')
    }

    const handleClear = () => {
        setQuery('')
        setResults(null)
        setError('')
        setExecutionTime(null)
        setPassword('')
    }

    const downloadCSV = () => {
        if (!results || !results.data || results.data.length === 0) return

        const headers = results.columns
        const csvRows = []

        csvRows.push(headers.join(','))

        for (const row of results.data) {
            const values = headers.map(header => {
                const val = row[header]
                const escaped = ('' + (val === null || val === undefined ? '' : val)).replace(/"/g, '""')
                return `"${escaped}"`
            })
            csvRows.push(values.join(','))
        }

        const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n")
        const encodedUri = encodeURI(csvContent)
        const link = document.createElement("a")
        link.setAttribute("href", encodedUri)
        link.setAttribute("download", `query_export_${Date.now()}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const downloadJSON = () => {
        if (!results || !results.data) return
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(results.data, null, 2))
        const downloadAnchor = document.createElement('a')
        downloadAnchor.setAttribute("href", dataStr)
        downloadAnchor.setAttribute("download", `query_export_${Date.now()}.json`)
        document.body.appendChild(downloadAnchor)
        downloadAnchor.click()
        document.body.removeChild(downloadAnchor)
    }

    const filteredData = React.useMemo(() => {
        if (!results || !results.data) return []
        if (!searchTerm.trim()) return results.data

        return results.data.filter(row => {
            return Object.values(row).some(val =>
                String(val).toLowerCase().includes(searchTerm.toLowerCase())
            )
        })
    }, [results, searchTerm])

    if (isAuthorized === false) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
                <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-lg text-center shadow-sm">
                    <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Restriced</h1>
                    <p className="text-gray-600 mb-6">
                        The Command Execution Terminal (excmd) is reserved exclusively for System Administrators, Developers, and authorized Support Personnel.
                        Your account does not possess the required administrative privileges.
                    </p>
                    <div className="text-sm text-red-500 bg-red-100/50 py-2 rounded-lg font-mono">
                        Error Code: 403_UNAUTHORIZED_ACCESS
                    </div>
                </div>
            </div>
        )
    }

    if (isAuthorized === null) {
        return (
            <div className="flex justify-center items-center min-h-[70vh]">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            </div>
        )
    }

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <QuerryTemplates
                    templates={templates}
                    handleTemplateClick={handleTemplateClick}
                />
                <QuerryEditor
                    handleExecute={handleExecute}
                    query={query}
                    handleClear={handleClear}
                    setQuery={setQuery}
                    password={password}
                    setPassword={setPassword}
                    isLoading={isLoading}
                    error={error}
                />
            </div>

            {results &&
                <QuerryResults
                    results={results}
                    executionTime={executionTime}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    downloadCSV={downloadCSV}
                    downloadJSON={downloadJSON}
                    filteredData={filteredData}
                />
            }

            {isLoading && <LoadingSpinner />}
        </>
    )
}

export default ExCmdMain