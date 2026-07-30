import CommonDropDown from "../../basicComponents/CommonDropDown"
import CommonTable from "../../basicComponents/commonTable"

function MyLeaveHistory({
    statusFilter,
    setStatusFilter,
    selectedYear,
    setSelectedYear,
    selectedMonth,
    setSelectedMonth,
    years,
    months,
    filteredHistory,
    historyColumns,
}) {
    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-4 p-3">

                <CommonDropDown
                    label=""
                    value={statusFilter}
                    onChange={setStatusFilter}
                    options={[
                        { label: 'All Status', value: 'all' },
                        { label: 'Approved', value: 'approved' },
                        { label: 'Pending', value: 'pending' },
                        { label: 'Rejected', value: 'rejected' },
                        { label: 'Cancelled', value: 'cancelled' }
                    ]}
                    placeholder="Filter by Status"
                />

                <CommonDropDown
                    label=""
                    value={selectedYear}
                    onChange={setSelectedYear}
                    options={years}
                    placeholder="Select Year"
                />

                <CommonDropDown
                    label=""
                    value={selectedMonth}
                    onChange={setSelectedMonth}
                    options={months}
                    placeholder="Select Month"
                />
            </div>

            <CommonTable
                columns={historyColumns}
                data={filteredHistory}
                itemsPerPage={10}
                showSearch={false}
                showPagination={true}
            />
        </>
    )
}

export default MyLeaveHistory