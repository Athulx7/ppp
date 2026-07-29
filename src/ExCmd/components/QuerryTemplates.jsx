import { Database } from "lucide-react"

function QuerryTemplates({ templates, handleTemplateClick }) {
    return (
        <>
            <div className="lg:col-span-1 bg-white rounded-md border border-gray-200 p-5 shadow-sm space-y-4">
                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-indigo-500" />
                    Query Templates
                </h2>
                <p className="text-xs text-gray-500">
                    Click a template to load it into the editor space.
                </p>

                <div className="flex flex-col gap-2.5 pt-2">
                    {templates.map((tpl, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => handleTemplateClick(tpl.sql)}
                            className="w-full text-left px-3 py-2.5 rounded-lg border border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-xs font-medium text-gray-700 transition"
                        >
                            {tpl.label}
                        </button>
                    ))}
                </div>

                <div className="border-t border-gray-200 pt-4 mt-6">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Security Rules</h3>
                    <ul className="text-xs text-gray-600 list-disc list-inside space-y-1.5">
                        <li>Only <code className="bg-gray-100 px-1 py-0.5 rounded text-indigo-600 font-mono">SELECT</code> statements</li>
                        <li>Comments are automatically removed</li>
                        <li>Password required on execution</li>
                        <li>Data exports are logged</li>
                    </ul>
                </div>
            </div>
        </>
    )
}

export default QuerryTemplates