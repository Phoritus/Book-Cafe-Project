import { useState } from "react";
// Coffee icon replaced with custom SVG
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
  <div className="mb-0 ml-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-brown-600 font-medium hover:text-brown-700"
        >
            <svg width="51" height="51" viewBox="0 0 51 51" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
              <path fillRule="evenodd" clipRule="evenodd" d="M44.625 25.5009C44.625 26.1349 44.3731 26.743 43.9248 27.1913C43.4764 27.6397 42.8684 27.8915 42.2343 27.8915H14.535L24.7987 38.1553C25.0336 38.3742 25.222 38.6381 25.3526 38.9313C25.4833 39.2246 25.5536 39.5411 25.5592 39.8621C25.5649 40.1831 25.5058 40.502 25.3856 40.7996C25.2654 41.0973 25.0864 41.3677 24.8594 41.5947C24.6324 41.8217 24.362 42.0007 24.0643 42.1209C23.7666 42.2412 23.4478 42.3002 23.1268 42.2946C22.8058 42.2889 22.4893 42.2186 22.196 42.088C21.9028 41.9573 21.6388 41.7689 21.42 41.534L7.07622 27.1903C6.62854 26.742 6.37708 26.1344 6.37708 25.5009C6.37708 24.8674 6.62854 24.2598 7.07622 23.8115L21.42 9.46779C21.8732 9.04551 22.4726 8.81562 23.0919 8.82654C23.7112 8.83747 24.3021 9.08837 24.7401 9.52637C25.1781 9.96437 25.429 10.5553 25.44 11.1746C25.4509 11.794 25.221 12.3934 24.7987 12.8465L14.535 23.1103H42.2343C42.8684 23.1103 43.4764 23.3622 43.9248 23.8105C44.3731 24.2588 44.625 24.8669 44.625 25.5009Z" fill="#86422A"/>
            </svg>
        </button>
      </div>

      {/* Header Section */}
      <div className="text-center mb-8">
        <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4">
          <path fillRule="evenodd" clipRule="evenodd" d="M11.1212 10.4466C10.7701 10.1657 10.5448 9.75696 10.495 9.3101C10.4451 8.86324 10.5746 8.41486 10.8552 8.06347C11.0417 7.84698 11.1928 7.6024 11.303 7.33876C11.3166 7.3001 11.3257 7.26004 11.3302 7.21933V7.18133C11.3193 7.10262 11.2623 6.97233 10.8416 6.42676L10.7819 6.35619C10.4508 5.93276 9.83733 5.14833 9.67719 4.11962C9.48447 2.89276 9.94862 1.72562 10.8552 0.596474C11.141 0.260932 11.5461 0.0497856 11.9849 0.00774097C12.4236 -0.0343036 12.8615 0.096055 13.2058 0.371215C13.5501 0.646376 13.7738 1.04473 13.8295 1.48194C13.8852 1.91915 13.7686 2.36089 13.5043 2.71362C13.3178 2.93011 13.1667 3.17469 13.0565 3.43833C13.0429 3.47699 13.0338 3.51705 13.0293 3.55776V3.59305C13.0402 3.67176 13.0972 3.80205 13.5179 4.34762L13.5776 4.41819C13.9088 4.84162 14.5222 5.62605 14.6823 6.65476C14.875 7.88162 14.4109 9.04876 13.5043 10.1779C13.2234 10.529 12.8147 10.7542 12.3678 10.8041C11.921 10.854 11.4726 10.7272 11.1212 10.4466ZM7.09047 16.247V24.3899C7.09047 26.4528 8.76247 28.122 10.8226 28.122H21.6798C23.7426 28.122 25.4119 26.45 25.4119 24.3899V16.247H7.09047ZM3.69761 15.9078C3.69761 14.2222 5.06561 12.8542 6.75119 12.8542H29.8226C31.7123 12.8542 33.5246 13.6049 34.8607 14.9411C36.1969 16.2772 36.9476 18.0895 36.9476 19.9792C36.9476 21.8689 36.1969 23.6811 34.8607 25.0173C33.5246 26.3535 31.7123 27.1042 29.8226 27.1042H28.27C27.7307 28.4086 26.8167 29.5238 25.6437 30.3088C24.4707 31.0939 23.0913 31.5136 21.6798 31.5149H10.8226C8.93295 31.5149 7.12068 30.7642 5.78448 29.428C4.44828 28.0918 3.69761 26.2796 3.69761 24.3899V15.9078ZM28.8048 23.7113H29.8226C30.8124 23.7113 31.7617 23.3181 32.4616 22.6182C33.1615 21.9183 33.5548 20.969 33.5548 19.9792C33.5548 18.9894 33.1615 18.0401 32.4616 17.3402C31.7617 16.6403 30.8124 16.247 29.8226 16.247H28.8048V23.7113ZM0.644043 35.9256C0.644043 35.3857 0.858519 34.8679 1.24029 34.4862C1.62206 34.1044 2.13985 33.8899 2.67976 33.8899H32.5369C33.0768 33.8899 33.5946 34.1044 33.9764 34.4862C34.3581 34.8679 34.5726 35.3857 34.5726 35.9256C34.5726 36.4655 34.3581 36.9833 33.9764 37.3651C33.5946 37.7469 33.0768 37.9613 32.5369 37.9613H2.67976C2.13985 37.9613 1.62206 37.7469 1.24029 37.3651C0.858519 36.9833 0.644043 36.4655 0.644043 35.9256ZM18.998 8.06347C18.7338 8.4162 18.6172 8.85794 18.6729 9.29515C18.7286 9.73236 18.9523 10.1307 19.2966 10.4059C19.6409 10.681 20.0788 10.8114 20.5175 10.7693C20.9563 10.7273 21.3614 10.5162 21.6472 10.1806C22.551 9.05147 23.0179 7.88433 22.8252 6.65747C22.6623 5.62876 22.0516 4.84433 21.7205 4.4209L21.6635 4.35033C21.24 3.80747 21.183 3.67176 21.1722 3.59576V3.56047C21.1704 3.546 21.1794 3.50619 21.1993 3.44105C21.3095 3.17741 21.4607 2.93282 21.6472 2.71633C21.9115 2.3636 22.0281 1.92187 21.9724 1.48466C21.9166 1.04745 21.6929 0.64909 21.3486 0.37393C21.0043 0.0987693 20.5664 -0.0315894 20.1277 0.0104553C19.689 0.0524999 19.2838 0.263647 18.998 0.599188C18.0942 1.72833 17.6273 2.89547 17.82 4.12233C17.9829 5.15105 18.5936 5.93547 18.9248 6.3589L18.9818 6.42947C19.4052 6.97233 19.4622 7.10805 19.473 7.18405V7.21933C19.4749 7.23381 19.4658 7.27362 19.4459 7.33876C19.3357 7.6024 19.1845 7.84698 18.998 8.06347Z" fill="#BC956B"/>
        </svg>
        <h2 className="text-4xl md:text-5xl font-display font-bold text-darkBrown-500 font-crimson leading-tight">
          Edit Profile
        </h2>
        <p className="mt-1 text-brown-600">Change your information</p>
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
