import { useNavigate } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import { ArrowLeft, Download, Eye, X, ChevronDown, ChevronUp } from 'lucide-react'

function toWords(num) { return num.toLocaleString('en-IN') + ' Rupees'}

function PayslipDetailSheet({ payslip, onClose, onDownload }) {
    const [expandedSection, setExpandedSection] = useState('earnings')

    if (!payslip) return null

    const toggle = (section) => setExpandedSection(expandedSection === section ? null : section)

    const EarningRow = ({ label, amount }) => amount > 0 ? (
        <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
            <span className="text-sm text-gray-600">{label}</span>
            <span className="text-sm font-medium text-gray-900">₹{amount.toLocaleString('en-IN')}</span>
        </div>
    ) : null

    const DeductionRow = ({ label, amount }) => amount > 0 ? (
        <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
            <span className="text-sm text-gray-600">{label}</span>
            <span className="text-sm font-medium text-red-600">−₹{amount.toLocaleString('en-IN')}</span>
        </div>
    ) : null

    const Section = ({ id, label, children, total, totalColor = 'text-gray-900' }) => (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <button
                onClick={() => toggle(id)}
                className="w-full flex items-center justify-between px-4 py-3.5"
            >
                <p className="text-sm font-semibold text-gray-900">{label}</p>
                <div className="flex items-center gap-3">
                    <span className={`text-sm font-bold ${totalColor}`}>
                        ₹{total.toLocaleString('en-IN')}
                    </span>
                    {expandedSection === id
                        ? <ChevronUp size={16} className="text-gray-400" />
                        : <ChevronDown size={16} className="text-gray-400" />
                    }
                </div>
            </button>
            {expandedSection === id && (
                <div className="px-4 pb-3 border-t border-gray-100">
                    {children}
                </div>
            )}
        </div>
    )

    return (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />
            <div className="relative bg-white rounded-t-3xl max-h-[95vh] flex flex-col">

                <div className="flex-shrink-0 px-5 pt-3 pb-4 border-b border-gray-100">
                    <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
                    <div className="text-center mb-4">
                        <p className="text-base font-bold text-indigo-600">ACME Corp</p>
                        <p className="text-xs text-gray-500">123 Business Park, Bangalore - 560001</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-lg font-bold text-gray-900">{payslip.month_name} {payslip.year}</p>
                            <p className="text-xs text-gray-500 mt-0.5">Generated: {payslip.generated_date}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full
                                ${payslip.status === 'generated' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                {payslip.status === 'generated' ? 'Draft' : 'Processed'}
                            </span>
                            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100">
                                <X size={16} className="text-gray-500" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto hide-scrollbar px-4 py-4 space-y-3">

                    <div className="bg-indigo-600 rounded-2xl p-4 text-white">
                        <p className="text-xs text-white/70 mb-1">Net Pay (Take Home)</p>
                        <p className="text-3xl font-bold mb-1">₹{payslip.net_pay.toLocaleString('en-IN')}</p>
                        <p className="text-xs text-white/60">{toWords(payslip.net_pay)}</p>
                        <div className="grid grid-cols-2 gap-2 mt-3">
                            <div className="bg-white/15 rounded-xl p-2.5">
                                <p className="text-[10px] text-white/60">Gross</p>
                                <p className="text-sm font-semibold">₹{payslip.earnings.total_earnings.toLocaleString('en-IN')}</p>
                            </div>
                            <div className="bg-white/15 rounded-xl p-2.5">
                                <p className="text-[10px] text-white/60">Deductions</p>
                                <p className="text-sm font-semibold">₹{payslip.deductions.total_deductions.toLocaleString('en-IN')}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-2">
                        <p className="text-xs font-semibold text-gray-500 mb-2">Employee Details</p>
                        {[
                            { label: 'Name', value: payslip.emp_name },
                            { label: 'Employee ID', value: payslip.emp_code },
                            { label: 'Designation', value: payslip.designation },
                            { label: 'Department', value: payslip.department },
                            { label: 'Grade', value: payslip.grade },
                            { label: 'Bank', value: payslip.bank_name },
                            { label: 'Account No.', value: payslip.bank_account },
                            { label: 'IFSC', value: payslip.ifsc },
                        ].map(d => (
                            <div key={d.label} className="flex justify-between py-1 border-b border-gray-50 last:border-0">
                                <span className="text-xs text-gray-500">{d.label}</span>
                                <span className="text-xs font-medium text-gray-900">{d.value}</span>
                            </div>
                        ))}
                    </div>

                    <Section
                        id="earnings"
                        label="Earnings"
                        total={payslip.earnings.total_earnings}
                        totalColor="text-emerald-600"
                    >
                        <EarningRow label="Basic Salary" amount={payslip.earnings.basic} />
                        <EarningRow label="HRA" amount={payslip.earnings.hra} />
                        <EarningRow label="Special Allowance" amount={payslip.earnings.special_allowance} />
                        <EarningRow label="Conveyance" amount={payslip.earnings.conveyance} />
                        <EarningRow label="Medical" amount={payslip.earnings.medical} />
                        <EarningRow label="LTA" amount={payslip.earnings.lta} />
                        <EarningRow label="Overtime" amount={payslip.earnings.overtime} />
                        <EarningRow label="Bonus" amount={payslip.earnings.bonus} />
                    </Section>

                    {/* Deductions (collapsible) */}
                    <Section
                        id="deductions"
                        label="Deductions"
                        total={payslip.deductions.total_deductions}
                        totalColor="text-red-600"
                    >
                        <DeductionRow label="PF (Employee)" amount={payslip.deductions.pf_employee} />
                        <DeductionRow label="Professional Tax" amount={payslip.deductions.professional_tax} />
                        <DeductionRow label="Income Tax" amount={payslip.deductions.income_tax} />
                        <DeductionRow label="Loan Recovery" amount={payslip.deductions.loan_recovery} />
                    </Section>

                    {/* Employer contributions (collapsible) */}
                    <Section
                        id="employer"
                        label="Employer Contributions"
                        total={payslip.employer_contributions.total}
                        totalColor="text-blue-600"
                    >
                        <EarningRow label="PF (Employer)" amount={payslip.employer_contributions.pf_employer} />
                        <EarningRow label="Gratuity" amount={payslip.employer_contributions.gratuity} />
                        <EarningRow label="Insurance" amount={payslip.employer_contributions.insurance} />
                    </Section>

                    <p className="text-center text-[10px] text-gray-400 pb-2">
                        Computer generated statement · Signature not required
                    </p>
                </div>

                {/* Footer */}
                <div className="flex-shrink-0 px-4 py-4 border-t border-gray-100">
                    <button
                        onClick={() => onDownload(payslip)}
                        className="w-full py-3.5 bg-emerald-600 text-white rounded-2xl text-sm font-semibold
                                   flex items-center justify-center gap-2"
                    >
                        <Download size={16} /> Download PDF
                    </button>
                </div>
            </div>
        </div>
    )
}

// ─── Main PayslipsMobile ──────────────────────────────────────────────────────
function PayslipsMobile({ currentUser }) {
    const navigate = useNavigate()
    const [payslips, setPayslips] = useState([])
    const [selectedPayslip, setSelectedPayslip] = useState(null)
    const [yearFilter, setYearFilter] = useState('all')

    // Generate dummy payslips — same logic as PayslipsMain
    useEffect(() => {
        const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        const result = []

        for (let i = 0; i < 12; i++) {
            const date = new Date()
            date.setMonth(date.getMonth() - i)
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const year = date.getFullYear()
            const monthName = monthNames[date.getMonth()]
            const base = 45000

            const earnings = {
                basic: base,
                hra: base * 0.5,
                special_allowance: base * 0.2,
                conveyance: 3200,
                medical: 1250,
                lta: base * 0.05,
                overtime: i === 0 ? 3200 : 0,
                bonus: i === 0 ? 5000 : 0,
                total_earnings: 0,
            }
            earnings.total_earnings = Object.values(earnings).reduce((s, v) => s + (typeof v === 'number' ? v : 0), 0) - earnings.total_earnings

            const deductions = {
                pf_employee: base * 0.12,
                professional_tax: 200,
                income_tax: 2000,
                loan_recovery: i === 0 ? 1500 : 0,
                advance: 0,
                total_deductions: 0,
            }
            deductions.total_deductions = deductions.pf_employee + deductions.professional_tax + deductions.income_tax + deductions.loan_recovery

            const employer_contributions = {
                pf_employer: base * 0.12,
                gratuity: base * 0.048,
                insurance: 5000,
                total: 0,
            }
            employer_contributions.total = employer_contributions.pf_employer + employer_contributions.gratuity + employer_contributions.insurance

            result.push({
                id: `EMP001_${year}_${month}`,
                emp_code: 'EMP001',
                emp_name: 'Arjun Kumar',
                designation: 'Software Engineer',
                department: 'Engineering',
                grade: 'S3',
                month,
                month_name: monthName,
                year,
                generated_date: `${year}-${month}-10`,
                bank_account: '2345678901',
                bank_name: 'ICICI Bank',
                ifsc: 'ICIC0001234',
                pan: 'FGHIJ5678K',
                earnings,
                deductions,
                employer_contributions,
                net_pay: earnings.total_earnings - deductions.total_deductions,
                status: i === 0 ? 'generated' : 'processed',
                payment_date: i === 0 ? null : `${year}-${month}-25`,
            })
        }
        setPayslips(result)
    }, [])

    const years = [...new Set(payslips.map(p => p.year.toString()))].sort((a, b) => b - a)
    const filtered = yearFilter === 'all' ? payslips : payslips.filter(p => p.year.toString() === yearFilter)

    const latest = payslips[0]

    return (
        <div className="flex flex-col h-full bg-gray-50">
            {/* Header */}
            <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 pt-4 pb-3">
                <div className="flex items-center gap-3 mb-3">
                    <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-gray-100">
                        <ArrowLeft size={18} className="text-gray-600" />
                    </button>
                    <p className="text-base font-semibold text-gray-900">Payslips</p>
                </div>
                {/* Year filter chips */}
                <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                    <button onClick={() => setYearFilter('all')}
                        className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all
                            ${yearFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>
                        All Years
                    </button>
                    {years.map(y => (
                        <button key={y} onClick={() => setYearFilter(y)}
                            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all
                                ${yearFilter === y ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>
                            {y}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto hide-scrollbar">
                <div className="p-4 space-y-3">

                    {/* Latest payslip hero */}
                    {latest && (
                        <div className="bg-indigo-600 rounded-2xl p-4 text-white">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <p className="text-xs text-white/70 mb-1">Latest Payslip</p>
                                    <p className="text-lg font-bold">{latest.month_name} {latest.year}</p>
                                </div>
                                <span className="text-xs bg-white/20 text-white px-2.5 py-0.5 rounded-full">
                                    {latest.status === 'generated' ? 'Draft' : 'Processed'}
                                </span>
                            </div>
                            <p className="text-2xl font-bold mb-3">₹{latest.net_pay.toLocaleString('en-IN')}</p>
                            <div className="grid grid-cols-2 gap-2 mb-3">
                                <div className="bg-white/15 rounded-xl p-2.5">
                                    <p className="text-[10px] text-white/60 mb-0.5">Gross</p>
                                    <p className="text-sm font-semibold">₹{latest.earnings.total_earnings.toLocaleString('en-IN')}</p>
                                </div>
                                <div className="bg-white/15 rounded-xl p-2.5">
                                    <p className="text-[10px] text-white/60 mb-0.5">Deductions</p>
                                    <p className="text-sm font-semibold">₹{latest.deductions.total_deductions.toLocaleString('en-IN')}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => setSelectedPayslip(latest)}
                                    className="flex-1 bg-white text-indigo-600 rounded-xl py-2.5 text-sm font-semibold flex items-center justify-center gap-1.5">
                                    <Eye size={14} /> View
                                </button>
                                <button onClick={() => alert(`Downloading ${latest.month_name} ${latest.year}`)}
                                    className="flex-1 bg-white/20 text-white rounded-xl py-2.5 text-sm font-semibold flex items-center justify-center gap-1.5">
                                    <Download size={14} /> PDF
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Payslip list */}
                    <p className="text-xs font-medium text-gray-500">
                        {filtered.length} payslip{filtered.length !== 1 ? 's' : ''}
                    </p>

                    {filtered.map((p, i) => {
                        if (i === 0 && yearFilter === 'all') return null // skip — shown in hero above
                        return (
                            <div key={p.id}
                                className="bg-white border border-gray-200 rounded-2xl p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <span className="text-[10px] font-bold text-indigo-700">
                                                {p.month_name.slice(0, 3).toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">{p.month_name} {p.year}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                Gross ₹{p.earnings.total_earnings.toLocaleString('en-IN')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-emerald-600">₹{p.net_pay.toLocaleString('en-IN')}</p>
                                        <span className={`text-[10px] font-medium ${p.status === 'generated' ? 'text-yellow-600' : 'text-emerald-600'}`}>
                                            {p.status === 'generated' ? 'Draft' : 'Paid'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setSelectedPayslip(p)}
                                        className="flex-1 py-2 border border-gray-200 rounded-xl text-xs font-medium text-gray-600 flex items-center justify-center gap-1.5 hover:bg-gray-50">
                                        <Eye size={12} /> View
                                    </button>
                                    <button onClick={() => alert(`Downloading ${p.month_name} ${p.year}`)}
                                        className="flex-1 py-2 border border-indigo-200 bg-indigo-50 rounded-xl text-xs font-medium text-indigo-600 flex items-center justify-center gap-1.5">
                                        <Download size={12} /> PDF
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Detail sheet */}
            <PayslipDetailSheet
                payslip={selectedPayslip}
                onClose={() => setSelectedPayslip(null)}
                onDownload={(p) => {
                    alert(`Downloading ${p.month_name} ${p.year}`)
                    setSelectedPayslip(null)
                }}
            />
        </div>
    )
}

export default PayslipsMobile