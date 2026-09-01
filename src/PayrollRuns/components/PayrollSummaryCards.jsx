import React from 'react';
import { 
    DollarSign, Users, TrendingUp, CreditCard, ShieldCheck, 
    CalendarDays, Clock, AlertCircle, Sparkles, Building2, CheckCircle2 
} from 'lucide-react';

export default function PayrollSummaryCards({ summary, selectedCount, totalCount }) {
    const cards = [
        {
            title: 'Total Gross Earnings',
            value: `₹${(summary.total_salary || 0).toLocaleString('en-IN')}`,
            subtext: `${selectedCount} of ${totalCount} employees selected`,
            icon: <DollarSign className="w-5 h-5 text-indigo-600" />,
            bgColor: 'bg-indigo-50/50',
            borderColor: 'border-indigo-100',
            textColor: 'text-indigo-900',
            badge: 'Base + Allowances'
        },
        {
            title: 'Loss of Pay (LOP) Deductions',
            value: `₹${(summary.total_lop_deductions || 0).toLocaleString('en-IN')}`,
            subtext: `Absences & unapproved leaves`,
            icon: <CalendarDays className="w-5 h-5 text-amber-600" />,
            bgColor: 'bg-amber-50/50',
            borderColor: 'border-amber-100',
            textColor: 'text-amber-900',
            badge: 'Attendance Adjusted'
        },
        {
            title: 'Overtime & Variable Pay',
            value: `₹${(summary.total_overtime_pay || 0).toLocaleString('en-IN')}`,
            subtext: `Logged hours & bonus additions`,
            icon: <Clock className="w-5 h-5 text-emerald-600" />,
            bgColor: 'bg-emerald-50/50',
            borderColor: 'border-emerald-100',
            textColor: 'text-emerald-900',
            badge: 'Additional Earnings'
        },
        {
            title: 'Total Deductions (PF/ESI/Taxes)',
            value: `₹${(summary.total_deductions || 0).toLocaleString('en-IN')}`,
            subtext: `Statutory + Advances + LOP`,
            icon: <CreditCard className="w-5 h-5 text-rose-600" />,
            bgColor: 'bg-rose-50/50',
            borderColor: 'border-rose-100',
            textColor: 'text-rose-900',
            badge: 'Employee Deductions'
        },
        {
            title: 'Net Salary Payable',
            value: `₹${(summary.net_payable || 0).toLocaleString('en-IN')}`,
            subtext: `Total Bank Disbursement Amount`,
            icon: <Sparkles className="w-5 h-5 text-indigo-600" />,
            bgColor: 'bg-gradient-to-br from-indigo-50 to-purple-50',
            borderColor: 'border-indigo-200',
            textColor: 'text-indigo-950 font-black',
            isMain: true,
            badge: 'Final Payout'
        },
        {
            title: 'Employer Cost & PF/ESI',
            value: `₹${(summary.employer_contribution || 0).toLocaleString('en-IN')}`,
            subtext: `Company-side statutory liability`,
            icon: <Building2 className="w-5 h-5 text-purple-600" />,
            bgColor: 'bg-purple-50/50',
            borderColor: 'border-purple-100',
            textColor: 'text-purple-900',
            badge: 'Employer Share'
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 mb-6">
            {cards.map((c, i) => (
                <div 
                    key={i} 
                    className={`rounded-xl border p-4 transition-all duration-200 hover:shadow-md ${c.bgColor} ${c.borderColor} flex flex-col justify-between`}
                >
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-[11px] font-semibold text-gray-600 line-clamp-1">{c.title}</span>
                        <div className="p-1.5 rounded-lg bg-white shadow-xs shrink-0">
                            {c.icon}
                        </div>
                    </div>

                    <div className="my-1">
                        <h4 className={`text-lg font-bold tracking-tight ${c.textColor}`}>
                            {c.value}
                        </h4>
                    </div>

                    <div className="pt-2 border-t border-black/5 flex items-center justify-between text-[10px]">
                        <span className="text-gray-500 line-clamp-1">{c.subtext}</span>
                        <span className="font-medium px-1.5 py-0.5 rounded bg-white/80 text-gray-700 shrink-0">
                            {c.badge}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}
