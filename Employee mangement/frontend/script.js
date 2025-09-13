
  const API_URL = "http://localhost:8080/api/employees";
  let editMode = false;

  // Fetch & render employees
  async function fetchEmployees() {
    const res = await fetch(API_URL);
    const data = await res.json();
    renderEmployees(data);
  }

  // Render employees
  function renderEmployees(employees) {
    const tbody = document.querySelector("#employeeTable tbody");
    tbody.innerHTML = "";
    employees.forEach(emp => {
      tbody.innerHTML += `
        <tr>
          <td>${emp.id}</td>
          <td>${emp.firstName} ${emp.lastName}</td>
          <td>${emp.email}</td>
          <td>${emp.department}</td>
          <td><span class="badge ${emp.status === 'Active' ? 'bg-success' : 'bg-danger'}">${emp.status}</span></td>
          <td>
            <button class="btn btn-sm btn-warning" onclick="editEmployee(${emp.id})"><i class="fas fa-edit"></i></button>
            <button class="btn btn-sm btn-danger" onclick="deleteEmployee(${emp.id})"><i class="fas fa-trash"></i></button>
          </td>
        </tr>
      `;
    });
  }

  // Add/Update employee
  document.getElementById("employeeForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    const id = document.getElementById("empId").value;
    const name = document.getElementById("empName").value.split(" ");
    const email = document.getElementById("empEmail").value;
    const dept = document.getElementById("empDept").value;
    const status = document.getElementById("empStatus").value;

    const employee = {
      firstName: name[0],
      lastName: name.slice(1).join(" ") || "",
      email,
      department: dept,
      position: "N/A",
      status
    };

    if (editMode) {
      await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employee)
      });
      editMode = false;
    } else {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employee)
      });
    }

    fetchEmployees();
    document.querySelector("#employeeForm").reset();
    bootstrap.Modal.getInstance(document.getElementById('employeeModal')).hide();
  });

  // Edit employee
  async function editEmployee(id) {
    const res = await fetch(`${API_URL}/${id}`);
    const emp = await res.json();
    document.getElementById("empId").value = emp.id;
    document.getElementById("empName").value = emp.firstName + " " + emp.lastName;
    document.getElementById("empEmail").value = emp.email;
    document.getElementById("empDept").value = emp.department;
    document.getElementById("empStatus").value = emp.status;
    document.querySelector("#employeeModal .modal-title").innerText = "Edit Employee";
    editMode = true;
    new bootstrap.Modal(document.getElementById('employeeModal')).show();
  }

  // Delete employee
  async function deleteEmployee(id) {
    if (confirm("Are you sure?")) {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      fetchEmployees();
    }
  }

  // Initial load
  fetchEmployees();
