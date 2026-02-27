import React, { useEffect, useState } from 'react'
import { Plus, LayoutDashboard, ChevronRight, Pencil } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import CommonButton from '../../basicComponents/CommonButton';
import CommonTable from '../../basicComponents/commonTable';
import { buildMasterTableColumns } from '../components/BuildMasterTableColumns';
import { ApiCall, getRoleBasePath } from '../../library/constants';
import Breadcrumb from '../../basicComponents/BreadCrumb';

function MasterMain() {

    const { menuId } = useParams();
    const navigate = useNavigate();

    const [master, setMaster] = useState(null);
    const [columns, setColumns] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        loadMasterList();
    }, [menuId]);

    const loadMasterList = async () => {
        setIsLoading(true)
        try {
            const response = await ApiCall("GET", `/master/${menuId}/getlist`)
            console.log("Master List Response:", response.data.data);

            const { master, fields, data } = response.data.data;
            console.log("Master Meta:", master);
            console.log("Master Fields:", fields);
            console.log("Master Data:", data);

            setMaster(master);

            const enrichedData = data.map((row) => ({
                ...row,
                onEdit: handleEdit
            }));

            console.log("Enriched Data:", enrichedData);

            setTableData(enrichedData);

            const tableColumns = buildMasterTableColumns(fields, handleEdit);
            setColumns(tableColumns);
            console.log("Table Columns:", tableColumns);

        } catch (err) {
            console.error("Failed to load master list", err);
        }
        setIsLoading(false)
    };

    const handleEdit = (row) => {
        navigate(`${getRoleBasePath()}/master/${menuId}/edit/${row.id}`)
    };

    if (!master) return null;
    return (
        <>
            <Breadcrumb
                items={[{ label: `${master.header_name}`, }]}
                title={master.header_name}
                description={`Manage and configure ${master.header_name.toLowerCase()}`}
                actions={<button
                    onClick={() => navigate(`${getRoleBasePath()}/master/${menuId}/add`)}
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