import React from "react";
import { Pencil } from "lucide-react";

export function buildMasterTableColumns(fields, onEdit) {
    const columns = [];

    columns.push({
        header: "Actions",
        cell: (row) => (
            <button
                className="text-indigo-600 font-medium flex items-center gap-1"
                onClick={() => onEdit(row)}
            >
                Edit <Pencil size={14} />
            </button>
        )
    });

    fields.forEach((field) => {
        if (field.field_type === "toggle" || field.column_name === "is_active") {
            columns.push({
                header: field.list_label || field.label,
                cell: (row) => (
                    <span
                        className={
                            row[field.column_name]
                                ? "text-green-600 font-medium"
                                : "text-red-600 font-medium"
                        }
                    >
                        {row[field.column_name] ? "Active" : "Inactive"}
                    </span>
                )
            });
        } else {
            columns.push({
                header: field.list_label || field.label,
                accessor: field.column_name
            });
        }
    });

    return columns;
}
