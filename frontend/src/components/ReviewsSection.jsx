import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const StarRating = ({ rating }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`w-5 h-5 ${star <= rating ? 'star-filled fill-current' : 'text-white/20'}`}
      />
    ))}
  </div>
);

const ReviewCard = ({ review, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    viewport={{ once: true }}
    className="glass rounded-3xl p-6 relative group hover:border-white/20 transition-all duration-300"
  >
    {/* Quote Icon */}
    <Quote className="absolute top-4 right-4 w-8 h-8 text-cyan-500/20" />

    {/* Header */}
    <div className="flex items-center gap-4 mb-4">
      <img
        src={review.avatar_url}
        alt={review.username}
        className="w-12 h-12 rounded-full border-2 border-cyan-500/30"
      />
      <div>
        <h4 className="font-unbounded font-bold text-white">{review.username}</h4>
        <p className="text-white/50 text-sm">{review.date}</p>
      </div>
    </div>

    {/* Rating */}
    <div className="mb-4">
      <StarRating rating={review.rating} />
    </div>

    {/* Comment */}
    <p className="text-white/80 leading-relaxed">{review.comment}</p>
  </motion.div>
);

const ReviewsSection = () => {
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const reviewsPerPage = 4;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${API}/reviews`);
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };
    fetchReviews();
  }, []);

  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const currentReviews = reviews.slice(
    currentPage * reviewsPerPage,
    (currentPage + 1) * reviewsPerPage
  );

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <section data-testid="reviews-section" className="relative z-20 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-unbounded text-3xl md:text-4xl font-bold text-white mb-4">
            Avis des <span className="text-pink-400">Joueurs</span>
          </h2>
          
          {/* Average Rating */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="flex items-baseline gap-2">
              <span className="font-unbounded text-5xl font-bold text-white">{averageRating}</span>
              <span className="text-white/50">/5</span>
            </div>
            <div className="flex flex-col items-start">
              <StarRating rating={Math.round(averageRating)} />
              <span className="text-white/50 text-sm mt-1">{reviews.length} avis</span>
            </div>
          </div>
        </motion.div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {currentReviews.map((review, index) => (
            <ReviewCard key={review.id} review={review} index={index} />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="p-2 rounded-full glass hover:bg-white/10 disabled:opacity-30 transition-all"
              data-testid="reviews-prev"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentPage ? 'bg-cyan-400 w-6' : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage === totalPages - 1}
              className="p-2 rounded-full glass hover:bg-white/10 disabled:opacity-30 transition-all"
              data-testid="reviews-next"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ReviewsSection;
