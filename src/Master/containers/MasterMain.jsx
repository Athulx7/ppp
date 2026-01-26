import React, { useEffect, useState } from 'react'
import { Plus, LayoutDashboard, ChevronRight, Pencil } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import CommonButton from '../../basicComponents/CommonButton';
import CommonTable from '../../basicComponents/commonTable';

function MasterMain() {

    const { menuId } = useParams();
    const navigate = useNavigate();

    const [meta, setMeta] = useState(null);
    const [tableData, setTableData] = useState([]);
    const [editRow, setEditRow] = useState(null);

    useEffect(() => {
        getMasterMeta(menuId).then(setMeta);
        getMasterData(menuId).then(setTableData);
    }, [menuId]);

    const handleEdit = (row) => {
        navigate(`/master/${menuId}/edit/${row.id}`);
    };

    const enrichedTableData = tableData.map(row => ({
        ...row,
        onEdit: handleEdit
    }));

    if (!meta) return null;
    return (
        <>
            <div className="flex items-center text-sm text-gray-600 mb-3">
                <Link to={'/'} className="flex items-center hover:text-gray-700 hover:underline">
                    <LayoutDashboard className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-gray-500">Dashboard</span>
                </Link>

                {meta.master_name && (
                    <>
                        <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
                        <Link to={`/master/${menuId}`} className="font-medium text-indigo-600 hover:text-indigo-700 hover:underline">
                            {meta.master_name}
                        </Link>
                    </>
                )}
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">{meta.master_name || 'Masters'}</h1>
                    <p className="text-gray-600 text-sm">
                        Manage and configure {meta.master_name ? meta.master_name.toLowerCase() : 'master'} data
                    </p>
                </div>

                <CommonButton
                    label='Add New'
                    icon={<Plus className="w-4 h-4" />}
                    iconPosition="left"
                    size='medium'
                    variant='primary'
                    onClick={() => navigate(`/master/${menuId}/add`)}
                    className="w-full sm:w-auto px-8"
                    rounded='md'
                />
            </div>

            <div className="">
                <CommonTable
                    columns={meta.tableColumns}
                    data={enrichedTableData}
                />
            </div>
        </>
    )
}

export default MasterMain

export const getMasterMeta = async (menuId) => {
    if (menuId === "17") {
        return {
            master_name: "Subarea Master",
            master_table: "tbl_subarea_mst",

            fields: [
                {
                    column: "subarea_code",
                    label: "Subarea Code",
                    type: "text",
                    visible: true
                },
                {
                    column: "subarea_name",
                    label: "Subarea Name",
                    type: "text",
                    visible: true
                },
                {
                    column: "subareaDate",
                    label: "Date Name",
                    type: "date",
                    visible: true
                },
                {
                    column: "region_id",
                    label: "Region",
                    type: "dropdown",
                    dropdown_source: "region"
                },
                {
                    column: "area_id",
                    label: "Area",
                    type: "dropdown",
                    dropdown_source: "area",
                    depends_on: "region_id"
                },
                {
                    column: "is_active",
                    label: "Active",
                    type: "toggle"
                }
            ],

            tableColumns: [
                {
                    header: "Actions",
                    cell: row => (
                        <button
                            className="text-indigo-600 font-medium"
                            onClick={() => row.onEdit(row)}
                        >
                            Edit
                        </button>
                    )
                },
                {
                    header: "Subarea Code",
                    accessor: "subarea_code"
                },
                {
                    header: "Subarea Name",
                    accessor: "subarea_name"
                },
                {
                    header: "Region",
                    accessor: "region_name"
                },
                {
                    header: "Status",
                    cell: row => (
                        <span className={row.is_active ? "text-green-600" : "text-red-600"}>
                            {row.is_active ? "Active" : "Inactive"}
                        </span>
                    )
                }
            ]

        };
    }
    else if (menuId === "18") {
        return {
            master_name: "Leave Master",
            master_table: "tbl_leave_mst",

            fields: [
                {
                    column: "leave_code",
                    label: "Leave Code",
                    type: "text",
                    visible: true
                },
                {
                    column: "leavwe_name",
                    label: "Leave Name",
                    type: "text",
                    visible: true
                },
                {
                    column: "carry_forward",
                    label: "Carry Forward",
                    type: "toggle",
                    visible: true
                },
                {
                    column: "is_active",
                    label: "Active",
                    type: "toggle"
                }
            ],

            tableColumns: [
                {
                    header: "Actions",
                    cell: row => (
                        <button
                            className="text-indigo-600 font-medium flex cursor-pointer"
                            onClick={() => row.onEdit(row)}
                        >
                            Edit <Pencil size={15} className='mt-1 ml-1' />
                        </button>
                    )
                },
                {
                    header: "Leave Code",
                    accessor: "leave_code"
                },
                {
                    header: "Leave Name",
                    accessor: "leave_name"
                },
                {
                    header: "Carry Forward",
                    cell: row => (
                        <span className={row.carry_forward ? "text-green-600" : "text-gray-500"}>
                            {row.carry_forward ? "Yes" : "No"}
                        </span>
                    )
                },
                {
                    header: "Status",
                    cell: row => (
                        <span className={row.is_active ? "text-green-600" : "text-red-600"}>
                            {row.is_active ? "Active" : "Inactive"}
                        </span>
                    )
                }
            ]
        };
    }
};
export const getMasterData = async (menuId) => {
    // 🔹 Sub Area Master
    if (menuId === "17") {
        return [
            {
                id: 1,
                subarea_code: "SA001",
                subarea_name: "Chennai South",
                region_id: 1,
                area_id: 11,
                region_name: "South",
                is_active: 1
            },
            {
                id: 2,
                subarea_code: "SA002",
                subarea_name: "Chennai North",
                region_name: "North",
                is_active: 1
            },
            {
                id: 3,
                subarea_code: "SA003",
                subarea_name: "Bangalore East",
                region_name: "East",
                is_active: 1
            },
            {
                id: 4,
                subarea_code: "SA004",
                subarea_name: "Hyderabad Central",
                region_name: "Central",
                is_active: 0
            }
        ]
    }

    if (menuId === "18") {
        return [
            {
                id: 101,
                leave_code: "L001",
                leave_name: "Casual Leave",
                carry_forward: 1,
                is_active: 1
            },
            {
                id: 102,
                leave_code: "L002",
                leave_name: "Sick Leave",
                carry_forward: 0,
                is_active: 1
            },
            {
                id: 103,
                leave_code: "L003",
                leave_name: "Earned Leave",
                carry_forward: 1,
                is_active: 1
            },
            {
                id: 104,
                leave_code: "L004",
                leave_name: "Maternity Leave",
                carry_forward: 0,
                is_active: 0
            }
        ]
    }

    return []
}

export const getMasterDataById = async (menuId, rowId) => {
    const list = await getMasterData(menuId)

    const record = list.find(item => String(item.id) === String(rowId))

    if (!record) {
        throw new Error("Record not found")
    }

    if (menuId === "17") {
        return {
            id: record.id,
            subarea_code: record.subarea_code,
            subarea_name: record.subarea_name,
            region_id: record.region_id,
            area_id: record.area_id,
            is_active: record.is_active
        }
    }

    else if (menuId === "18") {
        return {
            id: record.id,
            leave_code: record.leave_code,
            leave_name: record.leave_name,
            leave_type: record.leave_type,
            is_paid: record.is_paid,
            is_active: record.is_active
        }
    }

    throw new Error("Invalid menu id")
}
export const getDropdownOptions = async (source, params = {}) => {

    // REGION dropdown (no dependency)
    if (source === "region") {
        return [
            { value: 1, label: "South" },
            { value: 2, label: "North" },
            { value: 3, label: "East" },
            { value: 4, label: "West" },
            { value: 5, label: "Central" },
            { value: 6, label: "HQ" },
            { value: 7, label: "Remote" },
            { value: 8, label: "International" },
            { value: 9, label: "Others" },
            { value: 10, label: "Unassigned" },
            { value: 11, label: "Special Zone" },
            { value: 12, label: "New Region" },
            { value: 13, label: "Test Region" },
            { value: 14, label: "Demo Region" },
            { value: 15, label: "Sample Region" },
            { value: 16, label: "Temporary Region" },
            { value: 17, label: "Virtual Region" },
            { value: 18, label: "Experimental Region" },
            { value: 19, label: "Pilot Region" },
            { value: 20, label: "Beta Region" }
            
        ];
    }

    // AREA dropdown (depends on region_id)
    if (source === "area") {
        const regionId = params.region_id;

        const areaMap = {
            1: [
                { value: 11, label: "Chennai" },
                { value: 12, label: "Madurai" }
            ],
            2: [
                { value: 21, label: "Delhi" },
                { value: 22, label: "Noida" }
            ],
            3: [
                { value: 31, label: "Kolkata" }
            ],
            4: [
                { value: 41, label: "Mumbai" },
                { value: 42, label: "Pune" }
            ]
        };

        return areaMap[regionId] || [];
    }

    return [];
};
