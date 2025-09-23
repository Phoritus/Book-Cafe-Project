import { useState } from "react";
import { Coffee, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function EditProfile() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "Ms.",
    firstName: "Alice",
    lastName: "Wonderman",
    dob: "1996-08-15",
    nationalId: "1-2345-67890-12-3",
    phone: "080-000-0000",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Profile saved successfully!");
  };

  return (
    <div className="min-h-screen bg-[#f9f6f2] pt-6 px-4 pb-40"> {/* ลด pt-10 → pt-6 */}
      
      {/* Back Button */}
      <div className="mb-0 ml-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-brown-600 font-medium hover:text-brown-700"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      {/* Header Section */}
      <div className="text-center mb-8">
        <Coffee className="h-16 w-16 mx-auto mb-4" style={{ color: "#BC956B" }} />
        <h2 className="text-3xl font-display font-bold text-darkBrown-500">
          Edit Profile
        </h2>
        <p className="mt-2 text-brown-600">Change your information</p>
      </div>

      {/* Card Section */}
      <div className="card p-8 mt-6 max-w-md w-full mx-auto mb-20">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title + First + Last in one row */}
          <div className="flex gap-4">
            <div className="flex-1 max-w-[80px]">
              <label className="block text-sm font-medium text-brown-600 mb-2">Title</label>
              <input type="text" name="title" value={form.title} onChange={handleChange} className="input-field" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-brown-600 mb-2">First Name</label>
              <input type="text" name="firstName" value={form.firstName} onChange={handleChange} className="input-field" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-brown-600 mb-2">Last Name</label>
              <input type="text" name="lastName" value={form.lastName} onChange={handleChange} className="input-field" />
            </div>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-brown-600 mb-2">Date of Birth</label>
            <input type="date" name="dob" value={form.dob} onChange={handleChange} className="input-field" />
          </div>

          {/* National ID */}
          <div>
            <label className="block text-sm font-medium text-brown-600 mb-2">National ID Number</label>
            <input type="text" name="nationalId" value={form.nationalId} onChange={handleChange} className="input-field" />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-brown-600 mb-2">Phone Number</label>
            <input type="text" name="phone" value={form.phone} onChange={handleChange} className="input-field" />
          </div>

          {/* Save Button */}
          <div className="mt-8">
            <button type="submit" className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
              Save
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default EditProfile;
