import { motion } from "framer-motion";

const AdCard = ({ ad }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-linear-to-br from-violet-50 to-white rounded-2xl border border-violet-100 shadow-sm mb-4 overflow-hidden relative group"
        >
            <div className="absolute top-4 right-4 bg-violet-600/10 text-violet-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider z-10">
                Sponsored
            </div>

            {ad.media_url && (
                <div className="w-full aspect-video overflow-hidden">
                    <img
                        src={ad.media_url}
                        alt={ad.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </div>
            )}

            <div className="p-5">
                <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2">
                    {ad.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {ad.description}
                </p>

                {ad.cta_url && (
                    <a
                        href={ad.cta_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-full bg-violet-600 text-white font-semibold px-4 py-2.5 rounded-xl hover:bg-violet-700 transition shadow-sm text-sm"
                    >
                        {ad.cta_text || "Learn More"}
                    </a>
                )}
            </div>
        </motion.div>
    );
};

export default AdCard;
