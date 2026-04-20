"use client";

import React, { useEffect, useState } from "react";

const Page = () => {
  const [user, setUser] = useState({});
  const [list, setList] = useState([]);
  const [editId, setEditId] = useState(null);
  const [hobby, setHobby] = useState([]);
  const [errors, setErrors] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  const handleChange = (e) => {
    let { name, value, checked } = e.target;

    if (name === "hobby") {
      let updatedHobby = [...hobby];

      if (checked) updatedHobby.push(value);
      else updatedHobby = updatedHobby.filter((val) => val !== value);

      value = updatedHobby;
      setHobby(updatedHobby);
    }

    setUser({ ...user, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    let err = {};

    if (!user.name) err.name = "Name is required";
    if (!user.email) err.email = "Email is required";
    if (!user.phone) err.phone = "Phone is required";
    if (!user.address) err.address = "Address is required";
    if (!user.city) err.city = "City is required";
    if (!user.gender) err.gender = "Gender is required";
    if (hobby.length === 0) err.hobby = "Select at least one hobby";

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

    setCurrentPage(1);
  };

  const handleDelete = (id) => {
    const updatedList = list.filter((item) => item.id !== id);
    localStorage.setItem("users", JSON.stringify(updatedList));
    setList(updatedList);
  };

  const handleEdit = (id) => {
    const selected = list.find((item) => item.id === id);
    setUser(selected);
    setEditId(id);
    setHobby(selected?.hobby || []);
  };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("users")) || [];
    setList(stored);
  }, []);

  const totalPages = Math.max(4, Math.ceil(list.length / itemsPerPage));

  const start = (currentPage - 1) * itemsPerPage;
  const currentData = list.slice(start, start + itemsPerPage);

  return (
    <div className="container py-4">
      <div className="row justify-content-center mt-4">
        <div className="col-md-5">
          <form className="p-4 shadow rounded bg-light" onSubmit={handleSubmit}>
            <h2 className="text-center mb-3">Add Data</h2>

            <input className="form-control mb-2" placeholder="Name" name="name" value={user.name || ""} onChange={handleChange} />
            <span className="text-danger">{errors.name}</span>

            <input className="form-control mt-2" placeholder="Email" name="email" value={user.email || ""} onChange={handleChange} />
            <span className="text-danger">{errors.email}</span>

            <input className="form-control mt-2" placeholder="Phone" name="phone" value={user.phone || ""} onChange={handleChange} />
            <span className="text-danger">{errors.phone}</span>

            <textarea className="form-control mt-2" placeholder="Address" name="address" value={user.address || ""} onChange={handleChange} />
            <span className="text-danger">{errors.address}</span>

            <select className="form-control mt-2" name="city" value={user.city || ""} onChange={handleChange}>
              <option value="">Select City</option>
              <option>Ahmedabad</option>
              <option>Surat</option>
              <option>Rajkot</option>
            </select>
            <span className="text-danger">{errors.city}</span>

            <div className="mt-3">
              Gender:
              <input type="radio" name="gender" value="male" className="ms-3" checked={user.gender === "male"} onChange={handleChange} /> Male
              <input type="radio" name="gender" value="female" className="ms-3" checked={user.gender === "female"} onChange={handleChange} /> Female
            </div>
            <span className="text-danger">{errors.gender}</span>

            <div className="mt-3">
              Hobby:
              <input type="checkbox" value="reading" name="hobby" className="ms-3" checked={hobby.includes("reading")} onChange={handleChange} /> Reading
              <input type="checkbox" value="dancing" name="hobby" className="ms-3" checked={hobby.includes("dancing")} onChange={handleChange} /> Dancing
              <input type="checkbox" value="coding" name="hobby" className="ms-3" checked={hobby.includes("coding")} onChange={handleChange} /> Coding
            </div>
            <span className="text-danger">{errors.hobby}</span>

            <button className="btn btn-primary w-100 mt-3">
              {editId === null ? "Add Data" : "Update"}
            </button>
          </form>
        </div>
      </div>

      <div className="row justify-content-center mt-5">
        <div className="col-md-10">
          <table className="table table-bordered text-center">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
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
                    <td>{item.address}</td>
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
                <tr><td colSpan="9">Data Not Found</td></tr>
              )}
            </tbody>
          </table>

          <div className="pagination-box">

            <button
              onClick={() =>
                setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)
              }
            >
              Previous
            </button>

            {[...Array(totalPages || 1)].map((_, i) => (
              <button
                key={i}
                className={currentPage === i + 1 ? "active" : ""}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage(
                  currentPage < (totalPages || 1)
                    ? currentPage + 1
                    : (totalPages || 1)
                )
              }
            >
              Next
            </button>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Page;