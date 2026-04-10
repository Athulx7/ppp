import React from 'react'
import { Users } from 'lucide-react'
import StatusBadge from './StatusBadge'

const TEAM_LEAVE_DATA = [
    { name: 'Raj Kumar', department: 'Engineering', type: 'Sick Leave', status: 'approved', date: '2026-03-18' },
    { name: 'Maria Garcia', department: 'HR', type: 'Annual Leave', status: 'approved', date: '2026-03-19' },
    { name: 'Alex Turner', department: 'Sales', type: 'WFH', status: 'approved', date: '2026-03-20' },
]

function TeamLeaves() {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Users size={18} className="text-indigo-600" />
                Team Leaves This Month
            </h3>
            <div className="space-y-2">
                {TEAM_LEAVE_DATA.map((l, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border border-gray-200 rounded-xl hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-xs font-bold">
                                {l.name[0]}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900">{l.name}</p>
                                <p className="text-xs text-gray-500">{l.department} · {l.type}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <StatusBadge status={l.status} />
                            <p className="text-xs text-gray-400 mt-0.5">{l.date}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TeamLeaves
