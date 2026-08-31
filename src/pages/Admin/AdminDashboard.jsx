function AdminDashboard() {
    return (
        <div className="min-h-screen bg-gray-100 p-6">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">
                    Admin Dashboard
                </h1>
                <p className="mt-1 text-gray-500">
                    Welcome, BOY!
                </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

                {/* Total Patients */}
                <div className="rounded-xl bg-white p-6 shadow-sm">
                    <p className="text-sm font-medium text-gray-500">
                        Total Patients
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-gray-800">
                        1,245
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                        Registered patients
                    </p>
                </div>

                {/* Consultations */}
                <div className="rounded-xl bg-white p-6 shadow-sm">
                    <p className="text-sm font-medium text-gray-500">
                        Consultations Today
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-gray-800">
                        38
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                        Today's clinic visits
                    </p>
                </div>

                {/* Active Users */}
                <div className="rounded-xl bg-white p-6 shadow-sm">
                    <p className="text-sm font-medium text-gray-500">
                        Active Users
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-gray-800">
                        12
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                        Admin and clinic staff
                    </p>
                </div>

                {/* Medicine Stock */}
                <div className="rounded-xl bg-white p-6 shadow-sm">
                    <p className="text-sm font-medium text-gray-500">
                        Low Stock Medicines
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-red-600">
                        5
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                        Need restocking
                    </p>
                </div>
            </div>

            {/* Dashboard Content */}
            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">

                {/* Consultation Overview */}
                <div className="rounded-xl bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Consultation Overview
                        </h2>

                        <button className="text-sm text-blue-600 hover:underline">
                            View Reports
                        </button>
                    </div>

                    <div className="mt-6 flex h-64 items-center justify-center rounded-lg bg-gray-50">
                        <p className="text-gray-400">
                            Consultation chart
                        </p>
                    </div>
                </div>

                {/* Common Illnesses */}
                <div className="rounded-xl bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Common Illnesses
                        </h2>

                        <button className="text-sm text-blue-600 hover:underline">
                            View Details
                        </button>
                    </div>

                    <div className="mt-6 flex h-64 items-center justify-center rounded-lg bg-gray-50">
                        <p className="text-gray-400">
                            Common illnesses chart
                        </p>
                    </div>
                </div>
            </div>

            {/* Recent Activities */}
            <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">

                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Recent System Activities
                    </h2>

                    <button className="text-sm text-blue-600 hover:underline">
                        View All
                    </button>
                </div>

                <div className="mt-4 divide-y">

                    <div className="flex items-center justify-between py-4">
                        <div>
                            <p className="font-medium text-gray-700">
                                New clinic staff registered
                            </p>

                            <p className="text-sm text-gray-400">
                                User Management
                            </p>
                        </div>

                        <span className="text-sm text-gray-400">
                            10 min ago
                        </span>
                    </div>

                    <div className="flex items-center justify-between py-4">
                        <div>
                            <p className="font-medium text-gray-700">
                                Patient record updated
                            </p>

                            <p className="text-sm text-gray-400">
                                Patient Management
                            </p>
                        </div>

                        <span className="text-sm text-gray-400">
                            25 min ago
                        </span>
                    </div>

                    <div className="flex items-center justify-between py-4">
                        <div>
                            <p className="font-medium text-gray-700">
                                Medicine inventory updated
                            </p>

                            <p className="text-sm text-gray-400">
                                Medicine Inventory
                            </p>
                        </div>

                        <span className="text-sm text-gray-400">
                            1 hour ago
                        </span>
                    </div>

                    <div className="flex items-center justify-between py-4">
                        <div>
                            <p className="font-medium text-gray-700">
                                Monthly report generated
                            </p>

                            <p className="text-sm text-gray-400">
                                Reports
                            </p>
                        </div>

                        <span className="text-sm text-gray-400">
                            2 hours ago
                        </span>
                    </div>

                </div>
            </div>

        </div>
    );
}

export default AdminDashboard;