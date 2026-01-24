import React, { useEffect, useState } from 'react'
import { getMasterDataById, getMasterMeta } from './MasterMain';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ChevronRight, LayoutDashboard } from 'lucide-react';
import MasterForm from '../components/MasterForm';

function MasterFormPage() {
    const location = useLocation();
    const isEditPage = location.pathname.includes('/edit/');
    const isAddPage = location.pathname.includes('/add') || location.pathname.includes('/new');
    const { menuId, rowId } = useParams();
    const navigate = useNavigate();

    const [meta, setMeta] = useState(null);
    const [formData, setFormData] = useState(null);

    useEffect(() => {
        getMasterMeta(menuId).then(setMeta);

        if (rowId) {
            getMasterDataById(menuId, rowId).then(setFormData);
        } else {
            setFormData({});
        }
    }, [menuId, rowId]);

    if (!meta || !formData) return null;

    return (
        <>
            <div className="flex items-center text-sm text-gray-600 mb-3 flex-wrap">
                <Link to={'/'} className="inline-flex items-center hover:text-gray-700 transition-colors">
                    <LayoutDashboard className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-gray-500">Dashboard</span>
                </Link>

                {meta.master_name && (
                    <>
                        <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
                        <Link
                            to={`/master/${menuId}`}
                            className="inline-flex items-center font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                        >
                            {meta.master_name}
                        </Link>

                        {(isEditPage || isAddPage) && (
                            <>
                                <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
                                <span className="font-medium text-gray-900">
                                    {isEditPage ? 'Edit' : 'Add New'}
                                </span>
                            </>
                        )}
                    </>
                )}
            </div>
            <h1 className="text-xl font-bold mb-4">
                {rowId ? `Edit ${meta.master_name}` : `Add ${meta.master_name}`}
            </h1>

            <MasterForm
                meta={meta}
                initialData={formData}
                onCancel={() => navigate(`/master/${menuId}`)}
            />

        </>
    )
}

export default MasterFormPage
