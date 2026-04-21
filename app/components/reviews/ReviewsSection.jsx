import React from "react";
import { TRUSTPILOT_STARS } from "../../utils/productData";

const reviews = [
  {
    name: "Susan R.",
    title: "Finally something that actually works",
    body: "I'll admit I was pretty doubtful at first, but NutraBoost really won me over. The gel goes on smooth, sinks in fast, and after using it consistently for a few weeks I genuinely started seeing my feet look better. No overpowering scent, no greasy residue, it just does what it's supposed to do without any fuss.",
  },
  {
    name: "Robert T.",
    title: "Best results I've seen in ages",
    body: "I've been through the wringer trying everything, soaks, creams, even stuff my doctor prescribed. This is honestly the first time in forever that my feet actually look healthier and clearer. The gel is really easy to apply exactly where you need it, and considering the results, the price is more than fair. Definitely worth giving it a shot.",
  },
  {
    name: "Linda B.",
    title: "Convenient and actually effective",
    body: "The gel applicator makes this so easy to use with zero mess. The formula feels mild on my skin but clearly gets the job done. My feet already look way healthier, and the irritation and weird discoloration I had before have really calmed down. I keep it in my bathroom and use it daily. Would absolutely recommend this to anyone dealing with the same issues.",
  },
];

export default function ReviewsSection() {
  return (
    <section className="border-t border-slate-100 rounded-2xl">
      <div className="max-w-[800px] mx-auto px-4">
        {/* Title Center */}
        <h2 className="text-lg font-bold text-center text-slate-900 mb-8">
          Over 4,000 5-Star Reviews
        </h2>

        {/* 👇 Vertical Reviews */}
        <div className="flex flex-col gap-6">
          {reviews.map((r) => (
            <ReviewCard key={r.name} {...r} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewCard({ name, title, body }) {
  return (
    <div className="border border-gray-200 rounded-xl p-5 bg-white">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <StarRating />
          <span className="font-semibold text-gray-900 text-sm">{name}</span>
        </div>
        <span className="text-green-500 text-sm font-medium">
          Verified Buyer
        </span>
      </div>
      <p className="font-bold text-gray-900 text-sm mb-2">{title}</p>
      <p className="text-gray-600 text-sm leading-relaxed">{body}</p>
    </div>
  );
}

function StarRating() {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="w-6 h-6 bg-green-500 rounded-sm flex items-center justify-center"
        >
          <svg
            className="w-4 h-4 text-white"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
      ))}
    </div>
  );
}
