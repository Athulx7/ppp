import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import MasterForm from "../components/MasterForm";
import { ApiCall, getRoleBasePath } from "../../library/constants";
import Breadcrumb from "../../basicComponents/BreadCrumb";

function MasterFormPage() {
    const { menuId, rowId } = useParams()
    const navigate = useNavigate()
    const [meta, setMeta] = useState(null)
    const [formData, setFormData] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

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
            <Breadcrumb
                items={[{ label: `${meta.master_name}`, }, { label: `${meta.master_name}`, to: `${getRoleBasePath()}/master/${menuId}` }, { label: rowId ? "Edit" : "Add New" }]}
                title={meta.master_name}
                description={rowId ? `Edit ${meta.master_name}` : `Add ${meta.master_name}`}
                actions={<button
                    onClick={() => navigate(`${getRoleBasePath()}/master/${menuId}/add`)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    Add New
                </button>}
                loading={isLoading}
            />

            <MasterForm
                meta={meta}
                initialData={formData}
                isEdit={!!rowId}
                onCancel={() => navigate(`${getRoleBasePath()}/master/${menuId}`)}
                setIsLoading={setIsLoading}
                isLoading={isLoading}
            />
        </>
    )
}

export default MasterFormPage
