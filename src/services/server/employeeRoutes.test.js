import { normalizeEmployee } from "./employeeRoutes.js";

describe("normalizeEmployee", () => {
  test("should create a valid employee object", () => {
    const input = {
      name: "John Doe",
      email: "john@example.com",
      phone: "+1-555-123-4567",
      department: "Medical",
      role: "Doctor",
      hireDate: "2024-01-15",
    };
    const result = normalizeEmployee(input);
    expect(result).toEqual(input);
  });

  test("should trim whitespace", () => {
    const input = {
      name: "  John Doe  ",
      email: "  john@example.com  ",
      phone: "  +1-555-123-4567  ",
      department: "  Medical  ",
      role: "  Doctor  ",
      hireDate: "  2024-01-15  ",
    };
    const result = normalizeEmployee(input);
    expect(result.name).toBe("John Doe");
    expect(result.email).toBe("john@example.com");
  });

  test("should reject if name is missing", () => {
    expect(() => {
      normalizeEmployee({
        name: "",
        email: "john@example.com",
        phone: "+1-555-123-4567",
        department: "Medical",
        role: "Doctor",
        hireDate: "2024-01-15",
      });
    }).toThrow("Employee name is required");
  });

  test("should reject if name is too short", () => {
    expect(() => {
      normalizeEmployee({
        name: "J",
        email: "john@example.com",
        phone: "+1-555-123-4567",
        department: "Medical",
        role: "Doctor",
        hireDate: "2024-01-15",
      });
    }).toThrow("Employee name is required and must be at least 2 characters");
  });

  test("should reject invalid email", () => {
    expect(() => {
      normalizeEmployee({
        name: "John Doe",
        email: "invalid-email",
        phone: "+1-555-123-4567",
        department: "Medical",
        role: "Doctor",
        hireDate: "2024-01-15",
      });
    }).toThrow("Enter a valid email address");
  });

  test("should reject invalid phone", () => {
    expect(() => {
      normalizeEmployee({
        name: "John Doe",
        email: "john@example.com",
        phone: "123",
        department: "Medical",
        role: "Doctor",
        hireDate: "2024-01-15",
      });
    }).toThrow("Enter a valid phone number");
  });

  test("should accept various phone formats", () => {
    const formats = [
      "+1-555-123-4567",
      "555-123-4567",
      "(555) 123-4567",
      "555 123 4567",
      "+1 555 123 4567",
    ];
    formats.forEach((phone) => {
      const result = normalizeEmployee({
        name: "John Doe",
        email: "john@example.com",
        phone,
        department: "Medical",
        role: "Doctor",
        hireDate: "2024-01-15",
      });
      expect(result.phone).toBe(phone);
    });
  });

  test("should reject missing department", () => {
    expect(() => {
      normalizeEmployee({
        name: "John Doe",
        email: "john@example.com",
        phone: "+1-555-123-4567",
        department: "",
        role: "Doctor",
        hireDate: "2024-01-15",
      });
    }).toThrow("Department is required");
  });

  test("should reject missing role", () => {
    expect(() => {
      normalizeEmployee({
        name: "John Doe",
        email: "john@example.com",
        phone: "+1-555-123-4567",
        department: "Medical",
        role: "",
        hireDate: "2024-01-15",
      });
    }).toThrow("Role is required");
  });

  test("should reject invalid date format", () => {
    expect(() => {
      normalizeEmployee({
        name: "John Doe",
        email: "john@example.com",
        phone: "+1-555-123-4567",
        department: "Medical",
        role: "Doctor",
        hireDate: "01/15/2024",
      });
    }).toThrow("Enter a valid hire date (YYYY-MM-DD)");
  });

  test("should reject invalid date", () => {
    expect(() => {
      normalizeEmployee({
        name: "John Doe",
        email: "john@example.com",
        phone: "+1-555-123-4567",
        department: "Medical",
        role: "Doctor",
        hireDate: "2024-02-30", // February 30 doesn't exist
      });
    }).toThrow("Enter a valid hire date (YYYY-MM-DD)");
  });

  test("should reject if not an object", () => {
    expect(() => {
      normalizeEmployee("not an object");
    }).toThrow("An employee object is required");
  });

  test("should reject if input is an array", () => {
    expect(() => {
      normalizeEmployee([]);
    }).toThrow("An employee object is required");
  });

  test("should reject if fields exceed max length", () => {
    const longString = "a".repeat(501);
    expect(() => {
      normalizeEmployee({
        name: longString,
        email: "john@example.com",
        phone: "+1-555-123-4567",
        department: "Medical",
        role: "Doctor",
        hireDate: "2024-01-15",
      });
    }).toThrow("An employee field exceeds the maximum length");
  });
});
