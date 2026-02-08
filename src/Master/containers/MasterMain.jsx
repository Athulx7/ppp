import React, { useEffect, useState } from 'react'
import { Plus, LayoutDashboard, ChevronRight, Pencil } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import CommonButton from '../../basicComponents/CommonButton';
import CommonTable from '../../basicComponents/commonTable';
import { buildMasterTableColumns } from '../components/BuildMasterTableColumns';
import { ApiCall, getRoleBasePath } from '../../library/constants';

function MasterMain() {

    const { menuId } = useParams();
    const navigate = useNavigate();

    const [master, setMaster] = useState(null);
    const [columns, setColumns] = useState([]);
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        loadMasterList();
    }, [menuId]);

    const loadMasterList = async () => {
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
    };

    const handleEdit = (row) => {
        navigate(`${getRoleBasePath()}/master/${menuId}/edit/${row.id}`)
    };

    if (!master) return null;
    return (
        <>
            <div className="flex items-center text-sm text-gray-600 mb-3">
                <Link to="/" className="flex items-center hover:underline">
                    <LayoutDashboard className="w-4 h-4 mr-2 text-gray-400" />
                    Dashboard
                </Link>

                <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />

                <span className="font-medium text-indigo-600">
                    {master.header_name}
                </span>
            </div>

            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {master.header_name}
                    </h1>
                    <p className="text-gray-600 text-sm">
                        Manage and configure {master.header_name.toLowerCase()}
                    </p>
                </div>

                <button
                    onClick={() => navigate(`${getRoleBasePath()}/master/${menuId}/add`)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    Add New
                </button>
            </div>

            <CommonTable
                columns={columns}
                data={tableData}
            />
        </>
    )
}

export default MasterMain