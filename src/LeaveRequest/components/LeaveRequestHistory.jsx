import React from 'react'
import CommonDropDown from '../../basicComponents/CommonDropDown'
import CommonDatePicker from '../../basicComponents/CommonDatePicker'
import CommonTable from '../../basicComponents/commonTable'

function LeaveRequestHistory({
    statusFilter,setStatusFilter,
    dateRange,setDateRange,requestColumns,filteredRequests
}) {
    return (
        <>
            <div>
                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-3">

                    <CommonDropDown
                        label=""
                        value={statusFilter}
                        onChange={setStatusFilter}
                        options={[
                            { label: 'All Status', value: 'all' },
                            { label: 'Pending', value: 'pending' },
                            { label: 'Approved', value: 'approved' },
                            { label: 'Rejected', value: 'rejected' },
                            { label: 'Cancelled', value: 'cancelled' }
                        ]}
                        placeholder="Filter by Status"
                    />

                    <CommonDatePicker
                        label=""
                        value={dateRange.from}
                        onChange={(val) => setDateRange({ ...dateRange, from: val })}
                        placeholder="From Date"
                    />

                    <CommonDatePicker
                        label=""
                        value={dateRange.to}
                        onChange={(val) => setDateRange({ ...dateRange, to: val })}
                        placeholder="To Date"
                    />
                </div>

                <CommonTable
                    columns={requestColumns}
                    data={filteredRequests}
                    itemsPerPage={5}
                    showSearch={false}
                    showPagination={true}
                />
            </div>
        </>
    )
}

export default LeaveRequestHistory