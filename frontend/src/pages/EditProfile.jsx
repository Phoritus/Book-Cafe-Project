import { useState, useEffect } from 'react';
import Coffee from '../assets/Coffee.svg';
import { ArrowLeft, CalendarDays } from 'lucide-react';
import arrow from '../assets/Arrowcategory.svg';
import { fetchProfile, updateProfileApi } from '../api/profile';

function formatCitizen(id) {
  if (!id) return '';
  const raw = id.replace(/[^0-9]/g,'');
  if (raw.length !== 13) return id; // leave user typing
  return `${raw[0]}-${raw.slice(1,5)}-${raw.slice(5,10)}-${raw.slice(10,12)}-${raw.slice(12)}`;
}

function unformatCitizen(id) { return id.replace(/[^0-9]/g,''); }

function formatPhone(p) { return p; }

// We keep internal form state using original field names (title, firstName, lastName, dob, nationalId, phone)
const initialFormState = { title: '', firstName: '', lastName: '', dob: '', nationalId: '', phone: '' };

export default function EditProfile() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const profile = await fetchProfile();
        if (!active) return;
        setForm({
          title: profile.nameTitle || '',
          firstName: profile.firstname || '',
          lastName: profile.lastname || '',
          dob: profile.dateOfBirth ? profile.dateOfBirth.slice(0,10) : '',
          nationalId: formatCitizen(profile.citizen_id || ''),
          phone: profile.phone || ''
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    let v = value;
    if (name === 'citizen_id') v = formatCitizen(value);
    setForm(f => ({ ...f, [name]: v }));
    setErrors(err => ({ ...err, [name]: '' }));
  }

  function validate() {
    const err = {};
    if (!form.title) err.title = 'Title is required';
    if (!form.firstName.trim()) err.firstName = 'First name is required';
    if (!form.lastName.trim()) err.lastName = 'Last name is required';
    if (!form.dob) err.dob = 'Please enter your date of birth';
    if (form.nationalId) {
      const raw = unformatCitizen(form.nationalId);
      if (raw && raw.length !== 13) err.nationalId = 'Please enter a valid Thai National ID Number';
    }
    if (form.phone) {
      const phoneRegex = /^0\d{1,2}-?\d{3,4}-?\d{3,4}$/;
      if (!phoneRegex.test(form.phone)) err.phone = 'Please enter a valid Thai Phone Number';
    }
    if (form.dob) {
      const d = new Date(form.dob);
      if (isNaN(d.getTime()) || d > new Date()) err.dob = 'Invalid date of birth';
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    try {
      setSaving(true);
      // Map front form to backend keys (only send fields user edited – here we send all for simplicity)
      const payload = {
        nameTitle: form.title || '',
        firstname: form.firstName.trim(),
        lastname: form.lastName.trim(),
        dateOfBirth: form.dob || '',
        citizen_id: unformatCitizen(form.nationalId),
        phone: form.phone.replace(/[^+\d]/g,'')
      };
      await updateProfileApi(payload);
      alert('Profile saved successfully!');
    } catch (e) {
      console.error(e);
      alert(e.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="relative min-h-screen flex flex-1 items-center justify-center" style={{ backgroundColor: '#F6F3ED', fontFamily: "'inter', sans-serif" }}>
      <div className="min-h-screen" style={{ minHeight: '110vh' }}>
        <div className="absolute left-6 top-6 cursor-pointer" onClick={() => window.history.back()}>
          <ArrowLeft size={48} color="#86422A" />
        </div>
        <div className="text-center mb-8 !mt-10">
          <img src={Coffee} alt="Coffee icon" className="!h-20 !w-20 mx-auto text-brown-500 mb-6 animate-bounce-subtle" />
          <h2 className="text-4xl md:text-5xl font-display font-bold text-darkBrown-800 font-crimson" style={{ fontFamily: "'crimson text', sans-serif" }}>
            Edit Profile
          </h2>
          <p className="mt-1 text-brown-600">Change your information</p>
        </div>
        <div className="card p-8 mt-6 max-w-md w-full mx-auto mb-20" style={{background: '#FBFBFB'}}>
          {loading ? <p className="text-center text-brown-600">Loading...</p> : (
            <form onSubmit={handleSubmit} className="space-y-6" >
              <div className="flex gap-4">
                <div className="flex-1 max-w-[80px]">
                  <label className="block text-sm font-medium text-brown-600 mb-2">Title</label>
                  <div className="relative">
                    <select
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      onFocus={() => setIsOpen(true)}
                      onBlur={() => setIsOpen(false)}
                      className="input-field pr-8 appearance-none"
                    >
                      <option value="Mr.">Mr.</option>
                      <option value="Ms.">Ms.</option>
                      <option value="Mrs.">Mrs.</option>
                    </select>
                    <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-yellow-700 ">
                      <img src={arrow} alt="arrow" className={`h-3 w-3 transition-transform duration-200 ${isOpen ? '-rotate-90' : 'rotate-0'}`} />
                    </span>
                  </div>
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-brown-600 mb-2">First Name</label>
                  <input type="text" name="firstName" value={form.firstName} onChange={handleChange} className="input-field" />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-brown-600 mb-2">Last Name</label>
                  <input type="text" name="lastName" value={form.lastName} onChange={handleChange} className="input-field" />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-brown-600 mb-2">Date of Birth</label>
                <div className="relative">
                  <input type="date" name="dob" value={form.dob} onChange={handleChange} className="input-field pr-12" />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <CalendarDays size={25} color="#C2985B" strokeWidth={1.5} />
                  </div>
                </div>
                {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-brown-600 mb-2">National ID Number</label>
                <input type="text" name="nationalId" value={form.nationalId} onChange={handleChange} className="input-field" placeholder="1-2345-67890-12-3" />
                {errors.nationalId && <p className="text-red-500 text-sm mt-1">{errors.nationalId}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-brown-600 mb-2">Phone Number</label>
                <input type="text" name="phone" value={form.phone} onChange={handleChange} className="input-field" placeholder="080-000-0000" />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
              <div className="mt-8">
                <button type="submit" disabled={saving} className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
