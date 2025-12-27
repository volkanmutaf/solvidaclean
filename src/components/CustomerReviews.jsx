// src/components/CustomerReviews.jsx
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import FloorPlan from "./FloorPlan";

const reviews = [
  {
    name: "Emily Rios",
    date: "1 day ago",
    content:
      "Incredible service! The team was fast, friendly, and left our place sparkling. Highly recommend!",
    stars: 5,
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    source: "Google",
    verified: true,
  },
  {
    name: "John Patel",
    date: "2 days ago",
    content:
      "I’ve tried a few cleaning services before, but SolVida Clean stands out. They even left a thank you note!",
    stars: 5,
    avatar: "https://randomuser.me/api/portraits/men/16.jpg",
    source: "Google",
    verified: true,
  },
  {
    name: "Samantha Lee",
    date: "3 days ago",
    content:
      "Very thorough cleaning. I appreciated how they handled everything with care. Definitely using again!",
    stars: 5,
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    source: "Google",
    verified: true,
  },
  {
    name: "Carlos Mendes",
    date: "4 days ago",
    content:
      "I booked a move-out cleaning, and it looked better than when I moved in. 10/10!",
    stars: 5,
    avatar: "https://randomuser.me/api/portraits/men/41.jpg",
    source: "Facebook",
    verified: false,
  },
  {
    name: "Linda Zhao",
    date: "5 days ago",
    content:
      "We’ve been using them for bi-weekly cleanings and they never disappoint. Great attention to detail!",
    stars: 5,
    avatar: "https://randomuser.me/api/portraits/women/23.jpg",
    source: "Google",
    verified: true,
  },
  {
    name: "Tom Becker",
    date: "6 days ago",
    content:
      "Showed up early, finished on time, and left everything spotless. Super reliable.",
    stars: 5,
    avatar: "https://randomuser.me/api/portraits/men/28.jpg",
    source: "Facebook",
    verified: false,
  },
  {
    name: "Alicia Moore",
    date: "7 days ago",
    content:
      "Love that they use non-toxic products. My kids and pets are safe, and the house smells amazing!",
    stars: 5,
    avatar: "https://randomuser.me/api/portraits/women/34.jpg",
    source: "Google",
    verified: true,
  },
  {
    name: "David Kim",
    date: "8 days ago",
    content:
      "Efficient and friendly crew. Booking was easy and flexible. Great experience overall.",
    stars: 5,
    avatar: "https://randomuser.me/api/portraits/men/33.jpg",
    source: "Google",
    verified: true,
  },
  {
    name: "Melissa Tran",
    date: "9 days ago",
    content:
      "Super happy with the deep cleaning service. Bathroom tiles look brand new!",
    stars: 5,
    avatar: "https://randomuser.me/api/portraits/women/49.jpg",
    source: "Facebook",
    verified: true,
  },
  {
    name: "George Ivanov",
    date: "10 days ago",
    content:
      "Professional, quick, and reliable. Will be recommending to all my friends.",
    stars: 5,
    avatar: "https://randomuser.me/api/portraits/men/55.jpg",
    source: "Google",
    verified: true,
  },
  {
    name: "Jasmine Green",
    date: "11 days ago",
    content:
      "The team cleaned areas I didn’t even expect! Super satisfied and grateful for their work.",
    stars: 5,
    avatar: "https://randomuser.me/api/portraits/women/61.jpg",
    source: "Google",
    verified: true,
  },
  {
    name: "Brian Torres",
    date: "12 days ago",
    content:
      "We had a post-construction mess. SolVida came in and made it feel like home again. Impressive work!",
    stars: 5,
    avatar: "https://randomuser.me/api/portraits/men/48.jpg",
    source: "Facebook",
    verified: true,
  },
  {
    name: "Olivia Chen",
    date: "13 days ago",
    content:
      "Super kind crew, very detailed and organized. Will definitely book again next month.",
    stars: 5,
    avatar: "https://randomuser.me/api/portraits/women/17.jpg",
    source: "Google",
    verified: true,
  },
  {
    name: "Michael Yusuf",
    date: "14 days ago",
    content:
      "Quick, professional, and friendly. Loved the way the kitchen and floors turned out.",
    stars: 5,
    avatar: "https://randomuser.me/api/portraits/men/37.jpg",
    source: "Google",
    verified: false,
  },
  {
    name: "Isabelle Dyer",
    date: "15 days ago",
    content:
      "Everything smelled fresh and clean. I really appreciated the thoughtful touches!",
    stars: 5,
    avatar: "https://randomuser.me/api/portraits/women/10.jpg",
    source: "Google",
    verified: true,
  },
  {
    name: "Ethan Brooks",
    date: "16 days ago",
    content:
      "SolVida’s customer service is amazing. The cleaners were on time and very respectful.",
    stars: 5,
    avatar: "https://randomuser.me/api/portraits/men/6.jpg",
    source: "Facebook",
    verified: false,
  },
  {
    name: "Camila Rivera",
    date: "17 days ago",
    content:
      "Best cleaning service I’ve used so far. Booking was easy and the results were spotless.",
    stars: 5,
    avatar: "https://randomuser.me/api/portraits/women/38.jpg",
    source: "Google",
    verified: true,
  },
  {
    name: "Noah Jensen",
    date: "18 days ago",
    content:
      "You can tell they take pride in their work. I’ll definitely be a returning customer.",
    stars: 5,
    avatar: "https://randomuser.me/api/portraits/men/25.jpg",
    source: "Google",
    verified: true,
  },
  {
    name: "Sophia Martinez",
    date: "19 days ago",
    content:
      "Even the windows and blinds were spotless! Didn’t expect such detail. Great job!",
    stars: 5,
    avatar: "https://randomuser.me/api/portraits/women/20.jpg",
    source: "Facebook",
    verified: true,
  },
  {
    name: "Liam O’Connor",
    date: "20 days ago",
    content:
      "Affordable, efficient, and professional. Highly recommended for families.",
    stars: 5,
    avatar: "https://randomuser.me/api/portraits/men/31.jpg",
    source: "Google",
    verified: true,
  },
];

const GROUP_SIZE = 5;
const TOTAL_GROUPS = Math.ceil(reviews.length / GROUP_SIZE);

export default function CustomerReviews() {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);

  const visibleReviews = reviews.slice(
    currentIndex * GROUP_SIZE,
    currentIndex * GROUP_SIZE + GROUP_SIZE
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TOTAL_GROUPS);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  return (
    <>
      <section className="bg-[#2563EB] py-16 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-8">
            {t('customerReviews.title')}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 transition-all duration-500">
            {visibleReviews.map((review, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-md p-5 flex flex-col gap-3 hover:shadow-xl transition"
              >
                <div className="flex items-center gap-3">
                  {review.avatar ? (
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold">
                      {review.name[0]}
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900">
                      {review.name}
                    </span>
                    <span className="text-xs text-gray-500">{review.date}</span>
                  </div>
                </div>

                <div className="flex gap-1">
                  {[...Array(review.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>

                <p className="text-sm text-gray-700 line-clamp-4">
                  {review.content}
                </p>
              </div>
            ))}
          </div>

          {/* Dots */}
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: TOTAL_GROUPS }).map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentIndex === index ? "bg-white" : "bg-white/50"
                }`}
              ></button>
            ))}
          </div>

          {/* Separator */}
          <div className="mt-16 border-t border-white/20"></div>
        </div>
      </section>

      {/* Floor Plan Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <FloorPlan />
        </div>
      </section>
    </>
  );
}
