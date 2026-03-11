import React, { useEffect, useState } from "react"
import MasterForm from "../Master/components/MasterForm"
import { ApiCall } from "../library/constants"

function InlineMasterModal({
    open,
    masterCode,
    onClose,
    onCreated
}) {
    const [meta, setMeta] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!open || !masterCode) return
        loadMeta()
    }, [open, masterCode])

    const loadMeta = async () => {
        try {
            const res = await ApiCall("GET", `/master/${masterCode}/getcontents`)
            const data = res.data.data

            const inlineFields = data.fields.filter(
                f => f.show_in_inline !== 0
            )

            const normalizedMeta = {
                ...data.master,
                master_name: data.master.header_name,
                fields: inlineFields,
                autocode: data.autoCodePreview || ''
            }

            setMeta(normalizedMeta)

        } catch (err) {
            console.error("Inline master meta load failed", err)
        }
    }

    if (!open) return null

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg w-[800px] max-h-[90vh] overflow-auto p-6">

                <div className="flex justify-between items-center mb-4 border-b border-b-gray-400 pb-2">
                    <h2 className="text-lg font-semibold">
                        Create {meta?.master_name?.replace(/master/i, "").trim()}
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-red-500"
                    >
                        ✕
                    </button>
                </div>

                {meta && (
                    <MasterForm
                        meta={meta}
                        initialData={{}}
                        isEdit={false}
                        isInline={true}
                        setIsLoading={setLoading}
                        isLoading={loading}
                        onCancel={onClose}
                    />
                )}

            </div>
        </div>
    )
}

export default InlineMasterModal