import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronRight, LayoutDashboard } from "lucide-react";
import MasterForm from "../components/MasterForm";
import { ApiCall, getRoleBasePath } from "../../library/constants";

function MasterFormPage() {
    const { menuId, rowId } = useParams()
    const navigate = useNavigate()
    const [meta, setMeta] = useState(null)
    const [formData, setFormData] = useState(null)

    useEffect(() => {
        loadMetaAndData()
    }, [menuId, rowId])

    const loadMetaAndData = async () => {
        try {
            const metaRes = await ApiCall("GET", `/master/${menuId}/getcontents`)
            const apiMeta = metaRes.data.data
            const normalizedMeta = {
                ...metaRes.data.data.master,
                master_name: metaRes.data.data.master.header_name,
                fields: metaRes.data.data.fields,
                autocode: metaRes.data.data.autoCodePreview ? metaRes.data.data.autoCodePreview : ''
            }

            setMeta(normalizedMeta)

            if (rowId) {
                const recordRes = await ApiCall("GET", `/master/${menuId}/${rowId}`)
                console.log("Record Response:", recordRes)

                if (recordRes?.data?.success) {
                    const record = recordRes.data.data

                    const normalizedData = {}
                    apiMeta.fields.forEach(field => {
                        const value = record[field.column_name]

                        normalizedData[field.column_name] =
                            typeof value === "boolean"
                                ? value ? 1 : 0
                                : value ?? null
                    })

                    normalizedData.id = record.id

                    setFormData(normalizedData)
                }
            } else {
                setFormData({})
            }


        } catch (err) {
            console.error("Failed to load master form", err)
        }
    }

    if (!meta || formData === null) return null

    return (
        <>
            <div className="flex items-center text-sm text-gray-600 mb-3 flex-wrap overflow-y-hidden">
                <Link to="/" className="inline-flex items-center">
                    <LayoutDashboard className="w-4 h-4 mr-2 text-gray-400" />
                    Dashboard
                </Link>

                <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />

                <Link
                    to={`${getRoleBasePath()}/master/${menuId}`}
                    className="font-medium text-indigo-600"
                >
                    {meta.master_name}
                </Link>

                <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />

                <span className="font-medium text-gray-900">
                    {rowId ? "Edit" : "Add New"}
                </span>
            </div>
            <h1 className="text-xl font-bold mb-4">
                {rowId ? `Edit ${meta.master_name}` : `Add ${meta.master_name}`}
            </h1>

            <MasterForm
                meta={meta}
                initialData={formData}
                isEdit={!!rowId}
                onCancel={() => navigate(`${getRoleBasePath()}/master/${menuId}`)}
            />
        </>
    )
}

export default MasterFormPage
