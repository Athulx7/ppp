import React, { useEffect, useState } from 'react'
import { Plus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import CommonTable from '../../basicComponents/commonTable';
import { buildMasterTableColumns } from '../components/BuildMasterTableColumns';
import { ApiCall, getRoleBasePath } from '../../library/constants';
import Breadcrumb from '../../basicComponents/BreadCrumb';
import moment from 'moment';

function MasterMain() {

    const { mastercode } = useParams();
    const navigate = useNavigate();

    const [master, setMaster] = useState(null);
    const [columns, setColumns] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        loadMasterList();
    }, [mastercode]);

    const loadMasterList = async () => {
        setIsLoading(true)
        try {
            const response = await ApiCall("GET", `/master/${mastercode}/getlist`)

            const { master, fields, data } = response.data.data
            setMaster(master)

            const enrichedData = data.map((row) => {
                const formattedRow = { ...row }
                fields.forEach(field => {
                    if (field.field_type === "date" && formattedRow[field.column_name]) {
                        formattedRow[field.column_name] = moment(formattedRow[field.column_name]).format("DD/MM/YYYY")
                    }
                })
                formattedRow.onEdit = handleEdit
                return formattedRow
            })

            setTableData(enrichedData)

            const tableColumns = buildMasterTableColumns(fields, handleEdit)
            setColumns(tableColumns)

        } catch (err) {
            console.error("Failed to load master list", err)
        }
        setIsLoading(false)
    }

    const handleEdit = (row) => {
        navigate(`${getRoleBasePath()}/master/${mastercode}/edit/${row.id}`)
    }

    if (!master) return null
    return (
        <>
            <Breadcrumb
                items={[{ label: `${master.header_name}`, }]}
                title={master.header_name}
                description={`Manage and configure ${master.header_name.toLowerCase()}`}
                actions={<button
                    onClick={() => navigate(`${getRoleBasePath()}/master/${mastercode}/add`)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    Add New
                </button>}
                loading={isLoading}
            />

            <CommonTable
                columns={columns}
                data={tableData}
                loading={isLoading}
            />
        </>
    )
}

export default MasterMain