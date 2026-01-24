import React, { useEffect, useState } from 'react'
import CommonInputField from '../../basicComponents/CommonInputField';
import CommonDropDown from '../../basicComponents/CommonDropDown';
import CommonToggleButton from '../../basicComponents/CommonToggleButton';
import CommonButton from '../../basicComponents/CommonButton';
import CommonDatePicker from '../../basicComponents/CommonDatePicker';
import { getDropdownOptions } from '../containers/MasterMain';

function MasterForm({
    meta,
    initialData,
    onCancel,
    onSave
}) {
    const [formData, setFormData] = useState(initialData || {});
    const [dropdownOptions, setDropdownOptions] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setFormData(initialData || {});
    }, [initialData]);

    const handleChange = (key, value) => {
        setFormData(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSave = async () => {
        setSaving(true);

        try {
            // 🔹 later replace with real API
            console.log("Saving payload:", {
                master_table: meta.master_table,
                data: formData
            });

            if (onSave) onSave();
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        if (!meta?.fields) return;

        meta.fields.forEach(field => {
            if (field.type === "dropdown" && !field.depends_on) {
                getDropdownOptions(field.dropdown_source).then(options => {
                    setDropdownOptions(prev => ({
                        ...prev,
                        [field.column]: options
                    }));
                });
            }
        });
    }, [meta]);
    useEffect(() => {
        if (!meta?.fields) return;

        meta.fields.forEach(field => {
            if (field.type === "dropdown" && field.depends_on === "region_id") {
                const parentValue = formData.region_id;

                if (!parentValue) {
                    setDropdownOptions(prev => ({
                        ...prev,
                        [field.column]: []
                    }));
                    return;
                }

                getDropdownOptions(field.dropdown_source, {
                    region_id: parentValue
                }).then(options => {
                    setDropdownOptions(prev => ({
                        ...prev,
                        [field.column]: options
                    }));
                });
            }
        });
    }, [formData.region_id, meta]);



    const renderField = (field) => {
        const value = formData[field.column];

        switch (field.type) {
            case "text":
                return (
                    <CommonInputField
                        label={field.label}
                        value={value || ""}
                        onChange={v => handleChange(field.column, v)}
                        placeholder={`Enter ${field.label}`}
                    />
                );

            case "dropdown":
                return (
                    <CommonDropDown
                        label={field.label}
                        value={formData[field.column] || ""}
                        options={dropdownOptions[field.column] || []}
                        disabled={field.depends_on && !formData[field.depends_on]}
                        onChange={v => handleChange(field.column, v)}
                    />
                );

            case "toggle":
                return (
                    <CommonToggleButton
                        label={field.label}
                        checked={!!value}
                        onChange={v => handleChange(field.column, v ? 1 : 0)}
                    />
                );
            case "date":
                return (
                    <CommonDatePicker
                        label={field.label}
                        value={value || null}
                        onChange={v => handleChange(field.column, v)}
                    />
                );

            default:
                return null;
        }
    };
    return (
        <>
            <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {meta.fields
                        .filter(f => f.visible !== false)
                        .sort((a, b) => (a.priority || 0) - (b.priority || 0))
                        .map(field => (
                            <div key={field.column}>
                                {renderField(field)}
                            </div>
                        ))}
                </div>

                <div className="flex justify-start gap-3 mt-6">
                    <CommonButton
                        label="Cancel"
                        variant="cancel"
                        onClick={onCancel}
                        rounded='md'
                        className='px-8'

                    />
                    <CommonButton
                        label={saving ? "Saving..." : "Save"}
                        variant="primary"
                        size='medium'
                        disabled={saving}
                        onClick={handleSave}
                        rounded='md'
                        className='px-10'
                    />
                </div>
            </div>

        </>
    )
}

export default MasterForm
