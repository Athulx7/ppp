import React from 'react'
import { AlarmClock } from 'lucide-react'
import StatusBadge from './StatusBadge'

function RegularizationsPanel({ regRequests, openModal }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                    <AlarmClock size={15} className="text-emerald-600" /> Regularizations
                </h3>
                <button onClick={() => openModal('regularize')}
                    className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2.5 py-1 rounded-xl">+ New</button>
            </div>
            <div className="space-y-2">
                {regRequests.slice(0, 3).map(r => (
                    <div key={r.id} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl">
                        <div>
                            <p className="text-xs font-semibold text-gray-900">{r.date}</p>
                            <p className="text-[10px] text-gray-500">{r.punch_in} → {r.punch_out}</p>
                        </div>
                        <StatusBadge status={r.status} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default RegularizationsPanel
