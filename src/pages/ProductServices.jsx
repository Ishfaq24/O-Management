import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { FaLaptopCode, FaMobileAlt, FaServer, FaShoppingCart } from 'react-icons/fa';

const defaultServices = [
  { id: '1', name: 'Web Development', description: 'Custom responsive websites tailored to your needs.', icon: <FaLaptopCode /> },
  { id: '2', name: 'Mobile App Development', description: 'iOS and Android apps with modern UI/UX.', icon: <FaMobileAlt /> },
  { id: '3', name: 'API Integration', description: 'Seamless integration with third-party APIs.', icon: <FaServer /> },
  { id: '4', name: 'E-commerce Solutions', description: 'Full-fledged online stores with payment integration.', icon: <FaShoppingCart /> },
];

const ProductServices = () => {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ name: '', description: '' });
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user role
  useEffect(() => {
    const fetchUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setRole('employee');
        setLoading(false);
        return;
      }
      const { data, error } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      if (error) console.error(error);
      else setRole(data.role);
      setLoading(false);
    };
    fetchUserRole();
  }, []);

  // Fetch services from Supabase
  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase.from('product_services').select('*');
      if (error) console.error(error);
      else setServices(data.length ? data : defaultServices);
    };
    fetchServices();
  }, []);

  const handleAddService = async () => {
    if (!newService.name || !newService.description) return;

    const { data, error } = await supabase
      .from('product_services')
      .insert([{ name: newService.name, description: newService.description }])
      .select();

    if (error) console.error(error);
    else setServices([...services, data[0] || { ...newService, id: Date.now(), icon: <FaLaptopCode /> }]);

    setNewService({ name: '', description: '' });
  };

  if (loading) return <div className="p-6 text-center text-gray-500">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-green-50 via-white to-green-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-black-700">Our Product Services</h1>

      {/* Admin Add Service Panel */}
      {role === 'admin' && (
        <div className="mb-10 border p-6 rounded-2xl shadow-md bg-white">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Add New Service</h2>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <input
              type="text"
              placeholder="Service Name"
              className="border p-3 rounded w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={newService.name}
              onChange={(e) => setNewService({ ...newService, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Service Description"
              className="border p-3 rounded w-full md:w-2/3 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={newService.description}
              onChange={(e) => setNewService({ ...newService, description: e.target.value })}
            />
            <button
              className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 transition font-semibold"
              onClick={handleAddService}
            >
              Add Service
            </button>
          </div>
        </div>
      )}

      {/* Services Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <motion.div
            key={service.id || index}
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center gap-4 mb-4 text-green-600 text-3xl">
              {service.icon || <FaLaptopCode />}
              <h3 className="text-2xl font-bold">{service.name}</h3>
            </div>
            <p className="text-gray-700 mb-4">{service.description}</p>
            <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
              Featured
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProductServices;
