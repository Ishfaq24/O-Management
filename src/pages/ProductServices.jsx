import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabaseClient";
import {
  FaLaptopCode,
  FaMobileAlt,
  FaServer,
  FaShoppingCart,
  FaCloud,
  FaBrain,
  FaUsers,
  FaChalkboardTeacher,
  FaShieldAlt,
  FaRocket,
  FaPlus,
} from "react-icons/fa";

/* ================= DEFAULT SERVICES ================= */

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80";

const defaultServices = [
  {
    id: "1",
    name: "Full-Stack Web Development",
    description:
      "Scalable, secure, high-performance web applications using modern stacks.",
    icon: <FaLaptopCode />,
    tag: "Popular",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "2",
    name: "Mobile App Development",
    description:
      "Cross-platform Android & iOS apps with delightful UX and performance.",
    icon: <FaMobileAlt />,
    tag: "Trending",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "3",
    name: "Backend & API Engineering",
    description:
      "Secure, scalable REST & GraphQL APIs with real-world architecture.",
    icon: <FaServer />,
    tag: "Core",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "4",
    name: "E-commerce Solutions",
    description:
      "End-to-end stores with secure payments, dashboards & analytics.",
    icon: <FaShoppingCart />,
    tag: "Business",
    image:
      "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "5",
    name: "Cloud & DevOps",
    description:
      "CI/CD pipelines, cloud deployment, monitoring & scalability.",
    icon: <FaCloud />,
    tag: "Pro",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "6",
    name: "AI / ML Solutions",
    description:
      "AI-powered chatbots, recommendation systems & automation.",
    icon: <FaBrain />,
    tag: "Future",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
  },
];

/* ================= COMPONENT ================= */

const ProductServices = () => {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ name: "", description: "" });
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ===== Fetch user role ===== */
  useEffect(() => {
    const fetchUserRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setRole("employee");
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      setRole(data?.role || "employee");
      setLoading(false);
    };

    fetchUserRole();
  }, []);

  /* ===== Fetch services ===== */
  useEffect(() => {
    const fetchServices = async () => {
      const { data } = await supabase.from("product_services").select("*");
      setServices(data?.length ? data : defaultServices);
    };

    fetchServices();
  }, []);

  /* ===== Add service (Admin only) ===== */
  const handleAddService = async () => {
    if (!newService.name || !newService.description) return;

    const { data } = await supabase
      .from("product_services")
      .insert([newService])
      .select();

    if (data) {
      setServices([
        ...services,
        {
          ...data[0],
          icon: <FaRocket />,
          tag: "Custom",
          image: FALLBACK_IMAGE,
        },
      ]);
    }

    setNewService({ name: "", description: "" });
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-500">Loading services…</div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 py-20 px-6">
      {/* ===== Header ===== */}
      <div className="max-w-4xl mx-auto text-center mb-20">
        <h1 className="text-4xl md:text-5xl font-extrabold text-emerald-900  mb-4">
          What HackHub Builds 🚀
        </h1>
        <p className="text-lg text-gray-600">
          Production-grade software, AI systems, and platforms trusted by
          startups, students, and tech communities.
        </p>
      </div>

      {/* ===== Admin Panel ===== */}
      {role === "admin" && (
        <div className="max-w-5xl mx-auto mb-16 backdrop-blur-xl bg-white/70 border border-emerald-200 rounded-3xl p-8 shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Admin · Add New Service
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            <input
              placeholder="Service name"
              className="rounded-xl border p-4 focus:ring-2 focus:ring-emerald-400"
              value={newService.name}
              onChange={(e) =>
                setNewService({ ...newService, name: e.target.value })
              }
            />
            <input
              placeholder="Service description"
              className="rounded-xl border p-4 focus:ring-2 focus:ring-emerald-400 md:col-span-2"
              value={newService.description}
              onChange={(e) =>
                setNewService({ ...newService, description: e.target.value })
              }
            />
            <button
              onClick={handleAddService}
              className="md:col-span-3 mt-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl py-3 font-semibold flex items-center justify-center gap-2"
            >
              <FaPlus /> Add Service
            </button>
          </div>
        </div>
      )}

      {/* ===== Services Grid ===== */}
      <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {services.map((service, i) => (
          <motion.div
            key={service.id || i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -8 }}
            className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition"
          >
            {/* Image */}
            <div className="relative h-44">
              <img
                src={service.image}
                alt={service.name}
                loading="lazy"
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_IMAGE;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <span className="absolute top-4 left-4 bg-white/90 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
                {service.tag || "HackHub"}
              </span>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-center gap-3 text-emerald-600 text-2xl mb-3">
                {service.icon || <FaLaptopCode />}
                <h3 className="text-xl font-bold text-gray-900">
                  {service.name}
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProductServices;
