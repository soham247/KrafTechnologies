import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { supabase } from "../services/supabaseClient";
import { Link } from "react-router-dom";
// import getFeaturedInsights from "../backend/Source/ServicesModule/getFeaturedInsights"; // Adjust the import path as necessary
function FeaturedInsights() {
  const scrollRef = useRef(null);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getFeaturedInsights = async () => {
    const { data, error } = await supabase.from("FeaturedInsights").select("*");
    if (error) {
      console.error("Error fetching featured insights:", error);
      throw error;
    }
    return data;
  };

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await getFeaturedInsights();
        setInsights(response);
      } catch (error) {
        console.error("Error fetching featured insights:", error);
        setError(error.message || "Failed to load insights.");
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, [insights]);

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (container) {
      const scrollAmount = direction === "left" ? -300 : 300;
      container.scrollTo({
        left: container.scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="relative bg-black py-16 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden font-jost">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(24, 203, 150, 0.1) 1px, transparent 1px),
                             linear-gradient(to bottom, rgba(24, 203, 150, 0.1) 1px, transparent 1px)`,
            backgroundSize: "2rem 2rem",
          }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          className="flex justify-between items-end mb-12"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#18CB96] to-[#18CB96]/80 mb-4 pb-2">
              Featured Insights
            </h1>
            <p className="text-base md:text-lg text-gray-300 max-w-2xl leading-relaxed">
              Explore Kraf Technologies' insights on leveraging tech and talent
              to turn your vision into reality.
            </p>
          </div>
        </motion.div>

        <div className="relative">
          {loading ? (
            <div className="flex space-x-6 overflow-x-auto pb-8">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="flex-none w-full sm:w-[calc(100%-2rem)] md:w-[calc(50%-2rem)] lg:w-[calc(33.333%-2rem)] rounded-xl overflow-hidden bg-gray-900/70 border border-[#18CB96]/30"
                >
                  <div className="h-48 bg-gray-800 animate-pulse"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-800 rounded animate-pulse mb-3"></div>
                    <div className="h-4 bg-gray-800 rounded animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-800 rounded animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-800 rounded animate-pulse mb-4"></div>
                    <div className="flex items-center mt-4">
                      <div className="w-10 h-10 rounded-full bg-gray-800 animate-pulse mr-3"></div>
                      <div className="h-4 w-24 bg-gray-800 rounded animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          ) : (
            <div
              ref={scrollRef}
              className="flex space-x-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide"
              style={{ scrollSnapType: "x mandatory" }}
            >
              {insights &&
                insights.map((insight, index) => (
                  <motion.div
                    key={insight.id || index}
                    className="flex-none w-full sm:w-[calc(100%-2rem)] md:w-[calc(50%-2rem)] lg:w-[calc(33.333%-2rem)] rounded-xl overflow-hidden bg-gray-900/70 backdrop-blur-md border border-[#18CB96]/30 hover:shadow-[#18CB96]/40 transition-all duration-500"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                    style={{
                      background:
                        "radial-gradient(circle at 50% 50%, rgba(24, 203, 150, 0.15), rgba(0, 0, 0, 0.9))",
                    }}
                  >
                    <Link to={`/featured-insights/${insight.id}`}>
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={insight.image || "/placeholder.jpg"}
                          alt={insight.title || "Insight Image"}
                          className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-700"
                        />
                        <span className="absolute top-4 left-4 px-3 py-1 bg-[#18CB96]/90 rounded-full text-sm font-medium text-white">
                          {insight.category || "General"}
                        </span>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-medium text-white mb-3 line-clamp-2">
                          {insight.title || "Untitled Insight"}
                        </h3>
                        <div className="flex items-center mt-4">
                          <div className="w-10 h-10 rounded-full mr-3 border border-[#18CB96]/50 flex items-center justify-center bg-gray-800 text-white">
                            {insight.authorName?.charAt(0) || "A"}
                          </div>
                          <span className="text-gray-300 text-sm font-medium">
                            {insight.authorName || "Anonymous"}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
            </div>
          )}
          {insights && insights.length > 0 && (
            <>
              <motion.button
                onClick={() => scroll("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 p-3 bg-[#18CB96]/80 rounded-full shadow-lg hover:bg-[#18CB96]/60 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                aria-label="Scroll left"
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </motion.button>
              <motion.button
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-3 bg-[#18CB96]/80 rounded-full shadow-lg hover:bg-[#18CB96]/60 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                aria-label="Scroll right"
              >
                <ArrowRight className="w-6 h-6 text-white" />
              </motion.button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default FeaturedInsights;
