import { useState } from "react";
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
    <div className="min-h-screen " style={{ minHeight: '110vh' }}>
      {/* Back Button */}
  <div className="mt-6" style={{ marginLeft: '5rem' }}>
        <button
          onClick={() => navigate(-1)}
          className="back-btn-custom inline-flex items-center w-auto text-brown-600 font-medium hover:text-brown-700 p-0"
          style={{ background: 'transparent', border: 'none', width: 'auto', padding: 0, }}
        >
          <svg
            width="51"
            height="51"
            viewBox="0 0 51 51"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-11 h-11"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M44.625 25.5009C44.625 26.1349 44.3731 26.743 43.9248 27.1913C43.4764 27.6397 42.8684 27.8915 42.2343 27.8915H14.535L24.7987 38.1553C25.0336 38.3742 25.222 38.6381 25.3526 38.9313C25.4833 39.2246 25.5536 39.5411 25.5592 39.8621C25.5649 40.1831 25.5058 40.502 25.3856 40.7996C25.2654 41.0973 25.0864 41.3677 24.8594 41.5947C24.6324 41.8217 24.362 42.0007 24.0643 42.1209C23.7666 42.2412 23.4478 42.3002 23.1268 42.2946C22.8058 42.2889 22.4893 42.2186 22.196 42.088C21.9028 41.9573 21.6388 41.7689 21.42 41.534L7.07622 27.1903C6.62854 26.742 6.37708 26.1344 6.37708 25.5009C6.37708 24.8674 6.62854 24.2598 7.07622 23.8115L21.42 9.46779C21.8732 9.04551 22.4726 8.81562 23.0919 8.82654C23.7112 8.83747 24.3021 9.08837 24.7401 9.52637C25.1781 9.96437 25.429 10.5553 25.44 11.1746C25.4509 11.794 25.221 12.3934 24.7987 12.8465L14.535 23.1103H42.2343C42.8684 23.1103 43.4764 23.3622 43.9248 23.8105C44.3731 24.2588 44.625 24.8669 44.625 25.5009Z"
              fill="#86422A"
            />
          </svg>
        </button>
      </div>

      {/* Header Section */}
      <div className="text-center mb-8">
        {/* โลโก้กาแฟจาก public */}
        <img
          src='./src/assets/Coffee.svg' 
          alt=""
          className="h-16 w-16 mx-auto mt-6 animate-bounce-subtle"
        />

        {/* ไอคอน header เดิม */}
        <svg
          width="38"
          height="38"
          viewBox="0 0 38 38"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 mx-auto mb-2"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M11.1212 10.4466C10.7701 10.1657 10.5448 9.75696 10.495 9.3101C10.4451 8.86324 10.5746 8.41486 10.8552 8.06347C11.0417 7.84698 11.1928 7.6024 11.303 7.33876..."
            fill="#BC956B"
          />
        </svg>

        <h2 className="text-4xl md:text-5xl font-display font-bold text-darkBrown-800 font-crimson">
          Edit Profile
        </h2>
        <p className="mt-1 text-brown-600">Change your information</p>
      </div>

      {/* Card Section (form) */}
      <div className="card p-8 mt-6 max-w-md w-full mx-auto mb-20">
        <form onSubmit={handleSubmit} className="space-y-6">
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
                  className="input-field pr-8 appearance-none" // เพิ่ม padding ขวาให้วาง icon
                >
                  <option value="">---</option>
                  <option value="Mr.">Mr.</option>
                  <option value="Ms.">Ms.</option>
                  <option value="Mrs.">Mrs.</option>
                </select>
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  {/* ไอคอนใหม่ของ Title */}
                  <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.55664 9.80778L14.014 2.75996C14.5351 2.32574 15.3262 2.69627 15.3262 3.37454V16.6251C15.3262 17.3034 14.5351 17.6739 14.014 17.2397L5.55664 10.1919C5.4367 10.0919 5.4367 9.90773 5.55664 9.80778Z" fill="#C3A15E"/>
                  </svg>
                </div>
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
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 39 38"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect x="5.07617" y="9.5" width="28.5" height="23.75" rx="2" stroke="#C2A15E" strokeWidth="1.5"/>
                    <path d="M5.07617 13.5C5.07617 11.6144 5.07617 10.6716 5.66196 10.0858C6.24774 9.5 7.19055 9.5 9.07617 9.5H29.5762C31.4618 9.5 32.4046 9.5 32.9904 10.0858C33.5762 10.6716 33.5762 11.6144 33.5762 13.5V15.8333H5.07617V13.5Z" fill="#C2A15E"/>
                    <path d="M11.4102 4.75L11.4102 9.5" stroke="#C2A15E" strokeLinecap="round"/>
                    <path d="M27.2422 4.75L27.2422 9.5" stroke="#C2A15E" strokeLinecap="round"/>
                    <rect x="11.4102" y="19" width="6.33333" height="3.16667" rx="0.5" fill="#C2A15E"/>
                    <rect x="11.4102" y="25.3335" width="6.33333" height="3.16667" rx="0.5" fill="#C2A15E"/>
                    <rect x="20.9102" y="19" width="6.33333" height="3.16667" rx="0.5" fill="#C2A15E"/>
                    <rect x="20.9102" y="25.3335" width="6.33333" height="3.16667" rx="0.5" fill="#C2A15E"/>
                  </svg>
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

          <div className="mt-1">
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
  );
}

export default EditProfile;
