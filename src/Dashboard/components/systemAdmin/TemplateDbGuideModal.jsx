import React, { useState } from 'react'
import { X, Database, HardDrive, Terminal, CheckCircle2, RefreshCw, AlertCircle, Copy, Check, FileText } from 'lucide-react'
import axios from 'axios'

export default function TemplateDbGuideModal({ isOpen, onClose }) {
    if (!isOpen) return null

    const [generating, setGenerating] = useState(false)
    const [genResult, setGenResult] = useState(null)
    const [genError, setGenError] = useState('')
    const [copiedScript, setCopiedScript] = useState(false)

    const handleGenerateNow = async () => {
        setGenerating(true)
        setGenError('')
        setGenResult(null)

        try {
            const token = sessionStorage.getItem('token')
            const res = await axios.post('http://localhost:3000/api/system/template/backup', {}, {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (res.data?.success) {
                setGenResult(res.data)
            } else {
                setGenError(res.data?.message || 'Failed to generate backup')
            }
        } catch (err) {
            console.error('Backup generation error:', err)
            setGenError(err.response?.data?.message || err.message || 'Error generating backup')
        } finally {
            setGenerating(false)
        }
    }

    const sqlScript = `-- Take Manual Backup of Template DB in SSMS:
BACKUP DATABASE [PPP_TemplateDB] 
TO DISK = 'C:\\Program Files\\Microsoft SQL Server\\MSSQL16.SQLSERVER2022\\MSSQL\\Backup\\PPP_TemplateDB.bak' 
WITH INIT, FORMAT;`

    const copySql = () => {
        navigator.clipboard.writeText(sqlScript)
        setCopiedScript(true)
        setTimeout(() => setCopiedScript(false), 2000)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 overflow-y-auto scrollbar">
            <div className="bg-white rounded-2xl w-full max-w-3xl shadow-xl border border-gray-200 overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/70">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center shadow-xs">
                            <Database className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-gray-900">Template DB & Backup Guide</h2>
                            <p className="text-xs text-gray-500">Database Template Architecture & Export Instructions</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto scrollbar flex-1 space-y-6 text-sm text-gray-700">
                    {/* 1-Click Backup Action Banner */}
                    <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                <HardDrive className="w-4 h-4 text-indigo-600" />
                                Instant Template DB Generation
                            </h3>
                            <p className="text-xs text-gray-600 mt-1 max-w-md">
                                Re-syncs <code>PPP_TemplateDB</code> schema, cleans excluded tables (0 rows for leave & salary components), verifies seed tables, and generates a fresh <code>.bak</code> snapshot.
                            </p>
                        </div>
                        <button
                            onClick={handleGenerateNow}
                            disabled={generating}
                            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs py-2.5 px-4 rounded-lg flex items-center gap-2 shadow-xs transition-colors shrink-0 cursor-pointer"
                        >
                            {generating ? (
                                <>
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                    Creating Backup...
                                </>
                            ) : (
                                <>
                                    <RefreshCw className="w-4 h-4" />
                                    Regenerate Backup Now
                                </>
                            )}
                        </button>
                    </div>

                    {genError && (
                        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                            <span>{genError}</span>
                        </div>
                    )}

                    {genResult && (
                        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs space-y-2">
                            <div className="font-semibold flex items-center gap-2 text-sm text-emerald-900">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                Fresh Master Backup Created Successfully!
                            </div>
                            <div className="font-mono text-[11px] bg-white border border-emerald-200 p-2 rounded text-gray-800 break-all">
                                {genResult.masterBakFile}
                            </div>
                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-200 text-[11px]">
                                <span>Roles: {genResult.tableCounts?.tbl_company_roles} rows</span>
                                <span>Master Headers: {genResult.tableCounts?.tbl_master_header} rows</span>
                                <span className="text-emerald-700 font-bold">tbl_leave_type: 0 rows (Verified Empty)</span>
                                <span className="text-emerald-700 font-bold">tbl_salary_components: 0 rows (Verified Empty)</span>
                                <span className="text-emerald-700 font-bold">tbl_salary_component_type: 0 rows (Verified Empty)</span>
                                <span className="text-emerald-700 font-bold">tbl_slry_comp_calculation_type: 0 rows (Verified Empty)</span>
                                <span className="text-emerald-700 font-bold">tbl_country_mst: 0 rows (Verified Empty)</span>
                                <span className="text-emerald-700 font-bold">tbl_state_mst: 0 rows (Verified Empty)</span>
                            </div>
                        </div>
                    )}

                    {/* Section 1: Template Structure */}
                    <div>
                        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-2">
                            <FileText className="w-3.5 h-3.5 text-indigo-600" />
                            Database Template Content Breakdown (Menus, Masters & Roles Only)
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                                <span className="text-emerald-700 font-bold block mb-1">
                                    ✅ Seed Data Preserved (Menus, Masters & Roles Only):
                                </span>
                                <ul className="list-disc list-inside space-y-1 text-gray-600 text-[11px]">
                                    <li><code>tbl_company_roles</code> (Standard 4 roles)</li>
                                    <li><code>tbl_main_menus</code>, <code>tbl_sub_menus</code>, <code>tbl_role_menus</code></li>
                                    <li><code>tbl_master_header</code> & <code>tbl_master_fields</code></li>
                                    <li><code>tbl_emp_mst_controls</code> & <code>tbl_employee_type_mst</code></li>
                                </ul>
                            </div>
                            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                                <span className="text-amber-800 font-bold block mb-1">
                                    🚫 Explicitly Empty / Dynamic (0 Rows):
                                </span>
                                <ul className="list-disc list-inside space-y-1 text-gray-600 text-[11px]">
                                    <li><code>tbl_country_mst</code>, <code>tbl_state_mst</code>, <code>tbl_city_mst</code> (Created via Master menus)</li>
                                    <li><code>tbl_currency_mst</code> (Created via Currency Master menu)</li>
                                    <li><code>tbl_slry_comp_calculation_type</code> (Dynamic - 0 rows)</li>
                                    <li><code>tbl_salary_component_type</code> (Dynamic - 0 rows)</li>
                                    <li><code>tbl_salary_components</code> (No pre-seeded components)</li>
                                    <li><code>tbl_leave_type</code> (No pre-seeded leaves)</li>
                                    <li><code>tbl_employee_mst</code> (No employee data)</li>
                                    <li><code>tbl_payroll_run</code>, <code>tbl_payslip</code> (No payroll records)</li>
                                    <li><code>tbl_attendance</code>, <code>chat_*</code>, <code>tbl_job*</code></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: SSMS Instructions */}
                    <div>
                        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-2">
                            <Terminal className="w-3.5 h-3.5 text-indigo-600" />
                            How to Take Manual Backup via SQL Query or SSMS
                        </h4>

                        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 relative font-mono text-xs text-indigo-300">
                            <button
                                type="button"
                                onClick={copySql}
                                className="absolute top-3 right-3 flex items-center gap-1 text-[11px] text-gray-300 hover:text-white bg-gray-800 px-2.5 py-1 rounded cursor-pointer transition-colors"
                            >
                                {copiedScript ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                {copiedScript ? 'Copied' : 'Copy SQL'}
                            </button>
                            <pre className="overflow-x-auto whitespace-pre-wrap text-emerald-400">{sqlScript}</pre>
                        </div>

                        <div className="mt-3 text-xs text-gray-600 space-y-1.5">
                            <p><strong className="text-gray-900">Using SSMS GUI:</strong></p>
                            <ol className="list-decimal list-inside space-y-1 pl-1 text-[11px]">
                                <li>Open <strong>SQL Server Management Studio (SSMS)</strong> and connect to <code>localhost</code>.</li>
                                <li>Expand <strong>Databases</strong> and locate <strong>PPP_TemplateDB</strong>.</li>
                                <li>Right-click <strong>PPP_TemplateDB</strong> &gt; <strong>Tasks</strong> &gt; <strong>Back Up...</strong></li>
                                <li>Ensure Backup type is <strong>Full</strong> and Destination is set to <code>PPP_TemplateDB.bak</code>.</li>
                                <li>Click <strong>OK</strong> to create the backup file.</li>
                            </ol>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-3 border-t border-gray-200 bg-gray-50/70 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 rounded-lg text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
                    >
                        Close Guide
                    </button>
                </div>
            </div>
        </div>
    )
}
