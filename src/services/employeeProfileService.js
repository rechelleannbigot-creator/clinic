import { requestPatientApi } from "./userManagementService";

export const getMyProfile = async () => {
  const result = await requestPatientApi("/api/employees/me/profile");

  if (!result.employee?.id) {
    throw new Error("The employee service did not return your profile.");
  }

  return result.employee;
};

export const getEmployees = async (filters = {}) => {
  let path = "/api/employees";
  const params = new URLSearchParams();
  
  if (filters.department) params.append("department", filters.department);
  if (filters.role) params.append("role", filters.role);
  
  if (params.toString()) {
    path += `?${params.toString()}`;
  }

  const result = await requestPatientApi(path);

  if (!Array.isArray(result.employees)) {
    throw new Error("The employee service returned an invalid employee list.");
  }

  return result.employees;
};

export const getEmployeeById = async (employeeId) => {
  if (!employeeId || typeof employeeId !== "string") {
    throw new Error("Valid employee ID is required.");
  }

  const result = await requestPatientApi(`/api/employees/${encodeURIComponent(employeeId)}`);

  if (!result.employee?.id) {
    throw new Error("The employee service did not return a valid employee record.");
  }

  return result.employee;
};

export const getEmployeesByDepartment = async () => {
  const result = await requestPatientApi("/api/employees-by-department");

  if (!result.byDepartment || typeof result.byDepartment !== "object") {
    throw new Error("The employee service returned an invalid response.");
  }

  return result.byDepartment;
};

export const createEmployee = async (employeeData) => {
  if (!employeeData) {
    throw new Error("Employee data is required.");
  }

  const result = await requestPatientApi("/api/employees", {
    method: "POST",
    body: JSON.stringify(employeeData),
  });

  if (!result.employee?.id) {
    throw new Error("The employee service did not return the created employee.");
  }

  return result.employee;
};

export const updateEmployee = async (employeeId, employeeData) => {
  if (!employeeId || typeof employeeId !== "string") {
    throw new Error("Valid employee ID is required.");
  }

  if (!employeeData) {
    throw new Error("Employee data is required.");
  }

  const result = await requestPatientApi(
    `/api/employees/${encodeURIComponent(employeeId)}`,
    {
      method: "PUT",
      body: JSON.stringify(employeeData),
    },
  );

  if (!result.employee?.id) {
    throw new Error("The employee service did not return the updated employee.");
  }

  return result.employee;
};

export const deleteEmployee = async (employeeId) => {
  if (!employeeId || typeof employeeId !== "string") {
    throw new Error("Valid employee ID is required.");
  }

  const result = await requestPatientApi(
    `/api/employees/${encodeURIComponent(employeeId)}`,
    { method: "DELETE" },
  );

  return result;
};
