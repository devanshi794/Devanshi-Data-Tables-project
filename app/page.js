"use client";

import React, { useEffect, useState } from "react";

const Page = () => {
  const [user, setUser] = useState({});
  const [list, setList] = useState([]);
  const [editId, setEditId] = useState(null);
  const [hobby, setHobby] = useState([]);
  const [errors, setErrors] = useState({});
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const handleChange = (e) => {
    let { name, value, checked } = e.target;

    if (name === "hobby") {
      let updated = [...hobby];
      if (checked) updated.push(value);
      else updated = updated.filter((val) => val !== value);

      setHobby(updated);
      value = updated;
    }

    setUser({ ...user, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    let err = {};
    if (!user.name) err.name = "Name required";
    if (!user.email) err.email = "Email required";
    if (!user.phone) err.phone = "Phone required";
    if (!user.address) err.address = "Address required";
    if (!user.city) err.city = "City required";
    if (!user.gender) err.gender = "Gender required";
    if (hobby.length === 0) err.hobby = "Select hobby";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    let updatedList;

    if (editId === null) {
      updatedList = [...list, { ...user, hobby, id: Date.now() }];
    } else {
      updatedList = list.map((item) =>
        item.id === editId ? { ...user, hobby, id: editId } : item
      );
      setEditId(null);
    }

    localStorage.setItem("users", JSON.stringify(updatedList));
    setList(updatedList);

    setUser({});
    setHobby([]);
    setErrors({});
  };

  const handleDelete = (id) => {
    const updated = list.filter((item) => item.id !== id);
    setList(updated);
    localStorage.setItem("users", JSON.stringify(updated));
  };

  const handleEdit = (id) => {
    const selected = list.find((item) => item.id === id);
    setUser(selected);
    setEditId(id);
    setHobby(selected.hobby || []);
  };

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("users")) || [];
    setList(data);
  }, []);

  const filtered = list.filter((item) =>
    (item.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (item.city || "").toLowerCase().includes(search.toLowerCase()) ||
    (item.gender || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(4, Math.ceil(filtered.length / itemsPerPage));

  const start = (currentPage - 1) * itemsPerPage;
  const currentData = filtered.slice(start, start + itemsPerPage);

  const maleCount = list.filter((u) => u.gender === "male").length;
  const femaleCount = list.filter((u) => u.gender === "female").length;

  return (
    <div style={{ background: "#f5f7fb", minHeight: "100vh" }}>
      <div className="container py-5">

        <div className="row">

          <div className="col-md-4">
            <div className="bg-white p-4 rounded shadow">
              <h4>Add User</h4>

              <form onSubmit={handleSubmit}>
                <input className="form-control mb-2" placeholder="Name" name="name" value={user.name || ""} onChange={handleChange} />
                <small className="text-danger">{errors.name}</small>

                <input className="form-control mt-2" placeholder="Email" name="email" value={user.email || ""} onChange={handleChange} />
                <small className="text-danger">{errors.email}</small>

                <input className="form-control mt-2" placeholder="Phone" name="phone" value={user.phone || ""} onChange={handleChange} />
                <small className="text-danger">{errors.phone}</small>

                <textarea className="form-control mt-2" placeholder="Address" name="address" value={user.address || ""} onChange={handleChange} />
                <small className="text-danger">{errors.address}</small>

                <select className="form-control mt-2" name="city" value={user.city || ""} onChange={handleChange}>
                  <option value="">Select City</option>
                  <option>Ahmedabad</option>
                  <option>Surat</option>
                  <option>Rajkot</option>
                </select>

                <div className="mt-2">
                  Gender:
                  <input type="radio" name="gender" value="male" className="ms-2" checked={user.gender === "male"} onChange={handleChange} /> Male
                  <input type="radio" name="gender" value="female" className="ms-2" checked={user.gender === "female"} onChange={handleChange} /> Female
                </div>

                <div className="mt-2">
                  Hobby:
                  <input type="checkbox" value="reading" name="hobby" className="ms-2" checked={hobby.includes("reading")} onChange={handleChange} /> Reading
                  <input type="checkbox" value="coding" name="hobby" className="ms-2" checked={hobby.includes("coding")} onChange={handleChange} /> Coding
                  <input type="checkbox" value="dancing" name="hobby" className="ms-2" checked={hobby.includes("dancing")} onChange={handleChange} /> Dancing
                </div>

                <button className="btn btn-success w-100 mt-3">
                  {editId === null ? "Submit" : "Update"}
                </button>
              </form>
            </div>
          </div>

          <div className="col-md-8">

            <div className="row mb-3">
              <div className="col-md-4">
                <div className="p-3 text-white rounded text-center" style={{ background: "#4fc3f7" }}>
                  Male: {maleCount}
                </div>
              </div>
              <div className="col-md-4">
                <div className="p-3 text-white rounded text-center" style={{ background: "#29b6f6" }}>
                  Female: {femaleCount}
                </div>
              </div>
              <div className="col-md-4">
                <div className="p-3 text-white rounded text-center" style={{ background: "#0288d1" }}>
                  Total: {list.length}
                </div>
              </div>
            </div>

            <input
              className="form-control mb-3"
              placeholder="Search..."
              onChange={(e) => setSearch(e.target.value)}
            />

            <div className="p-2 rounded shadow" style={{ background: "#e3f2fd" }}>
              <table className="table text-center">
                <thead style={{ background: "#4fc3f7", color: "white" }}>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>City</th>
                    <th>Gender</th>
                    <th>Hobby</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {currentData.length > 0 ? (
                    currentData.map((item, index) => (
                      <tr key={item.id}>
                        <td>{start + index + 1}</td>
                        <td>{item.name}</td>
                        <td>{item.email}</td>
                        <td>{item.phone}</td>
                        <td>{item.city}</td>
                        <td>{item.gender}</td>
                        <td>{item.hobby?.join(", ")}</td>
                        <td>
                          <button className="btn btn-danger btn-sm me-2" onClick={() => handleDelete(item.id)}>Delete</button>
                          <button className="btn btn-warning btn-sm" onClick={() => handleEdit(item.id)}>Edit</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8">No Data Found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-end mt-3 gap-2">
              <button className="btn btn-secondary"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  className={`btn ${currentPage === i + 1 ? "btn-primary" : "btn-light"}`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}

              <button className="btn btn-secondary"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;