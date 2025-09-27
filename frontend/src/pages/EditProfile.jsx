import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Coffee from "../assets/Coffee.svg";
import { ArrowLeft ,CalendarDays} from 'lucide-react';
import arrow from "../assets/Arrowcategory.svg";

function EditProfile() {

  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    title: "Ms.",
    firstName: "Alice",
    lastName: "Wonderman",
    dob: "1996-08-15",
    nationalId: "1-2345-67890-12-3",
    phone: "080-000-0000",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    let newErrors = {};

    if (!form.title) newErrors.title = "Title is required";
    if (!form.firstName.trim()) newErrors.firstName = "First name is required";
    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!form.dob) newErrors.dob = "Please enter your date of birth";

    const nationalIdRegex = /^\d{1}-\d{4}-\d{5}-\d{2}-\d{1}$/;
    if (!form.nationalId || !nationalIdRegex.test(form.nationalId)) {
      newErrors.nationalId = "Please enter a valid Thai National ID Number";
    }

    const phoneRegex = /^0\d{1,2}-?\d{3,4}-?\d{3,4}$/;
    if (!form.phone || !phoneRegex.test(form.phone)) {
      newErrors.phone = "Please enter a valid Thai Phone Number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      alert("Profile saved successfully!");
    }
  };

  return (
    <section className="relative min-h-screen flex flex-1 items-center justify-center f" style={{ backgroundColor: "#F6F3ED" ,fontFamily: "'inter', sans-serif"}}>

      <div className="min-h-screen " style={{ minHeight: '110vh' }}>
        {/* Back Button */}
        <div
          className="absolute left-6 top-6 cursor-pointer left-30"
          onClick={() => window.history.back()}
        >
          <ArrowLeft size={48} color="#86422A" />
        </div>

        {/* Header Section */}
        <div className="text-center mb-8 !mt-10">
          <img src={Coffee} alt="Coffee icon" className="!h-20 !w-20 mx-auto text-brown-500 mb-6 animate-bounce-subtle" />


          <h2 className="text-4xl md:text-5xl font-display font-bold text-darkBrown-800 font-crimson" style={{ fontFamily: "'crimson text', sans-serif" }}>
            Edit Profile
          </h2>
          <p className="mt-1 text-brown-600">Change your information</p>
        </div>

        {/* Card Section (form) */}
        <div className="card p-8 mt-6 max-w-md w-full mx-auto mb-20" style={{background: "#FBFBFB"}} >
          <form onSubmit={handleSubmit} className="space-y-6" >
            <div className="flex gap-4">
              <div className="flex-1 max-w-[80px]">
                <label className="block text-sm font-medium text-brown-600 mb-2">
                  Title
                </label>
                <div className="relative">
                  <select
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    onFocus={() => setIsOpen(true)}
                    onBlur={() => setIsOpen(false)}
                    className="input-field pr-8 appearance-none" // เพิ่ม padding ขวาให้วาง icon
                  >
                    <option value="Mr.">Mr.</option>
                    <option value="Ms.">Ms.</option>
                    <option value="Mrs.">Mrs.</option>
                  </select>
                  <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-yellow-700 ">
                                          <img
                                            src={arrow}
                                            alt="arrow"
                                            className={`h-3 w-3 transition-transform duration-200 ${isOpen ? "-rotate-90" : "rotate-0"}`}
                                          />
                                        </span>
                </div>

                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-brown-600 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className="input-field"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                )}
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-brown-600 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className="input-field"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brown-600 mb-2">
                Date of Birth
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="dob"
                  value={form.dob}
                  onChange={handleChange}
                  className="input-field pr-12" // เพิ่ม padding ขวาให้วาง icon
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  {/* SVG ไอคอนปฏิทิน */}
                  <CalendarDays size={25} color="#C2985B" strokeWidth={1.5} />
                </div>
              </div>
              {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob}</p>}
            </div>


            <div>
              <label className="block text-sm font-medium text-brown-600 mb-2">
                National ID Number
              </label>
              <input
                type="text"
                name="nationalId"
                value={form.nationalId}
                onChange={handleChange}
                className="input-field"
                placeholder="1-2345-67890-12-3"
              />
              {errors.nationalId && (
                <p className="text-red-500 text-sm mt-1">{errors.nationalId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-brown-600 mb-2">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="input-field"
                placeholder="080-000-0000"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            <div className="mt-8">
              <button
                type="submit"
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default EditProfile;
