```jsx
import { useState } from "react";

function PatientsManagement() {
    const [search, setSearch] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);

    const [patients, setPatients] = useState([
        {
            id: "P-001",
            name: "Juan Dela Cruz",
            age: 21,
            sex: "Male",
            course: "BS Information Technology",
            contact: "09123456789",
            status: "Active",
        },
        {
            id: "P-002",
            name: "Maria Santos",
            age: 20,
            sex: "Female",
            course: "BS Nursing",
            contact: "09987654321",
            status: "Active",
        },
        {
            id: "P-003",
            name: "Mark Reyes",
            age: 22,
            sex: "Male",
            course: "BS Business Administration",
            contact: "09234567890",
            status: "Inactive",
        },
    ]);

    const [newPatient, setNewPatient] = useState({
        name: "",
        age: "",
        sex: "Male",
        course: "",
        contact: "",
    });

    // Search patients
    const filteredPatients = patients.filter((patient) =>
        patient.name.toLowerCase().includes(search.toLowerCase()) ||
        patient.id.toLowerCase().includes(search.toLowerCase()) ||
        patient.course.toLowerCase().includes(search.toLowerCase())
    );

    // Add patient
    const handleAddPatient = (e) => {
        e.preventDefault();

        const newId = `P-${String(patients.length + 1).padStart(3, "0")}`;

        const patient = {
            id: newId,
            name: newPatient.name,
            age: newPatient.age,
            sex: newPatient.sex,
            course: newPatient.course,
            contact: newPatient.contact,
            status: "Active",
        };

        setPatients([...patients, patient]);

        setNewPatient({
            name: "",
            age: "",
            sex: "Male",
            course: "",
            contact: "",
        });

        setShowAddModal(false);
    };

    // Activate / Deactivate patient
    const toggleStatus = (id) => {
        setPatients(
            patients.map((patient) =>
                patient.id === id
                    ? {
                          ...patient,
                          status:
                              patient.status === "Active"
                                  ? "Inactive"
                                  : "Active",
                      }
                    : patient
            )
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            {/* Page Header */}
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        Patients Management
                    </h1>

                    <p className="mt-1 text-gray-500">
                        Manage and monitor registered patients.
                    </p>
                </div>

                <button
                    onClick={() => setShowAddModal(true)}
                    className="rounded-lg bg-blue-600 px-5 py-3 font-medium
                               text-white hover:bg-blue-700"
                >
                    + Register Patient
                </button>

            </div>

            {/* Summary Cards */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

                <div className="rounded-xl bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Total Patients
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-gray-800">
                        {patients.length}
                    </h2>
                </div>

                <div className="rounded-xl bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Active Patients
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-green-600">
                        {
                            patients.filter(
                                (patient) => patient.status === "Active"
                            ).length
                        }
                    </h2>
                </div>

                <div className="rounded-xl bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Inactive Patients
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-red-600">
                        {
                            patients.filter(
                                (patient) => patient.status === "Inactive"
                            ).length
                        }
                    </h2>
                </div>

            </div>

            {/* Search Bar */}
            <div className="mb-6 rounded-xl bg-white p-4 shadow-sm">

                <input
                    type="text"
                    placeholder="Search patient by name, ID, or course..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-lg border border-gray-300
                               px-4 py-3 outline-none
                               focus:border-blue-500
                               focus:ring-2 focus:ring-blue-200"
                />

            </div>

            {/* Patients Table */}
            <div className="overflow-hidden rounded-xl bg-white shadow-sm">

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-gray-50">
                            <tr>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                    Patient
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                    Age / Sex
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                    Course
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                    Contact
                                </th>

                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                                    Status
                                </th>

                                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                                    Actions
                                </th>

                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">

                            {filteredPatients.length > 0 ? (
                                filteredPatients.map((patient) => (
                                    <tr
                                        key={patient.id}
                                        className="hover:bg-gray-50"
                                    >

                                        {/* Patient */}
                                        <td className="px-6 py-4">

                                            <div className="flex items-center gap-3">

                                                <div className="flex h-10 w-10 items-center
                                                                justify-center rounded-full
                                                                bg-blue-100 font-bold
                                                                text-blue-600">
                                                    {patient.name.charAt(0)}
                                                </div>

                                                <div>
                                                    <p className="font-medium text-gray-800">
                                                        {patient.name}
                                                    </p>

                                                    <p className="text-xs text-gray-400">
                                                        {patient.id}
                                                    </p>
                                                </div>

                                            </div>

                                        </td>

                                        {/* Age / Sex */}
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {patient.age} / {patient.sex}
                                        </td>

                                        {/* Course */}
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {patient.course}
                                        </td>

                                        {/* Contact */}
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {patient.contact}
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4">

                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                    patient.status === "Active"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {patient.status}
                                            </span>

                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4">

                                            <div className="flex justify-center gap-2">

                                                <button
                                                    className="rounded-lg border
                                                               border-gray-300 px-3 py-2
                                                               text-sm text-gray-600
                                                               hover:bg-gray-100"
                                                >
                                                    View
                                                </button>

                                                <button
                                                    className="rounded-lg border
                                                               border-blue-200 px-3 py-2
                                                               text-sm text-blue-600
                                                               hover:bg-blue-50"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        toggleStatus(patient.id)
                                                    }
                                                    className={`rounded-lg px-3 py-2 text-sm ${
                                                        patient.status === "Active"
                                                            ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                                                            : "bg-green-100 text-green-700 hover:bg-green-200"
                                                    }`}
                                                >
                                                    {patient.status === "Active"
                                                        ? "Deactivate"
                                                        : "Activate"}
                                                </button>

                                            </div>

                                        </td>

                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="px-6 py-10 text-center text-gray-400"
                                    >
                                        No patients found.
                                    </td>
                                </tr>
                            )}

                        </tbody>

                    </table>

                </div>

            </div>

            {/* Register Patient Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center
                                justify-center bg-black/40 p-4">

                    <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">

                        {/* Modal Header */}
                        <div className="mb-6 flex items-center justify-between">

                            <div>
                                <h2 className="text-xl font-bold text-gray-800">
                                    Register Patient
                                </h2>

                                <p className="text-sm text-gray-500">
                                    Add a new patient to the system.
                                </p>
                            </div>

                            <button
                                onClick={() => setShowAddModal(false)}
                                className="text-2xl text-gray-400 hover:text-gray-600"
                            >
                                ×
                            </button>

                        </div>

                        {/* Form */}
                        <form
                            onSubmit={handleAddPatient}
                            className="space-y-4"
                        >

                            {/* Full Name */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    required
                                    placeholder="Enter full name"
                                    value={newPatient.name}
                                    onChange={(e) =>
                                        setNewPatient({
                                            ...newPatient,
                                            name: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-lg border border-gray-300
                                               px-4 py-2.5 outline-none
                                               focus:border-blue-500"
                                />
                            </div>

                            {/* Age and Sex */}
                            <div className="grid grid-cols-2 gap-4">

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Age
                                    </label>

                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        placeholder="Age"
                                        value={newPatient.age}
                                        onChange={(e) =>
                                            setNewPatient({
                                                ...newPatient,
                                                age: e.target.value,
                                            })
                                        }
                                        className="w-full rounded-lg border border-gray-300
                                                   px-4 py-2.5 outline-none
                                                   focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">
                                        Sex
                                    </label>

                                    <select
                                        value={newPatient.sex}
                                        onChange={(e) =>
                                            setNewPatient({
                                                ...newPatient,
                                                sex: e.target.value,
                                            })
                                        }
                                        className="w-full rounded-lg border border-gray-300
                                                   px-4 py-2.5 outline-none
                                                   focus:border-blue-500"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>

                            </div>

                            {/* Course */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Course / Program
                                </label>

                                <input
                                    type="text"
                                    required
                                    placeholder="Enter course or program"
                                    value={newPatient.course}
                                    onChange={(e) =>
                                        setNewPatient({
                                            ...newPatient,
                                            course: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-lg border border-gray-300
                                               px-4 py-2.5 outline-none
                                               focus:border-blue-500"
                                />
                            </div>

                            {/* Contact */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Contact Number
                                </label>

                                <input
                                    type="text"
                                    required
                                    placeholder="Enter contact number"
                                    value={newPatient.contact}
                                    onChange={(e) =>
                                        setNewPatient({
                                            ...newPatient,
                                            contact: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-lg border border-gray-300
                                               px-4 py-2.5 outline-none
                                               focus:border-blue-500"
                                />
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end gap-3 pt-4">

                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="rounded-lg border border-gray-300
                                               px-5 py-2.5 text-gray-600
                                               hover:bg-gray-100"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="rounded-lg bg-blue-600 px-5 py-2.5
                                               font-medium text-white
                                               hover:bg-blue-700"
                                >
                                    Register Patient
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

        </div>
    );
}

export default PatientsManagement;
```
