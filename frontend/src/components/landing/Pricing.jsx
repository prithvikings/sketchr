import React from "react";

const Pricing = () => {
  const plans = [
    {
      target: "Student & Hobbyist",
      name: "Starter",
      price: "Free",
      billing: "Forever",
      description: "Perfect for personal projects and university assignments.",
      color: "bg-white",
      buttonStyle: "bg-zinc-100 text-zinc-900 border-2 border-zinc-800 hover:bg-zinc-200",
      features: [
        "Up to 3 active boards",
        "Standard templates",
        "7-day version history",
        "Export to PNG",
        "Community support"
      ]
    },
    {
      target: "Professional",
      name: "Pro",
      price: "$12",
      billing: "per user / month",
      description: "For freelancers and solo designers who need unlimited power.",
      color: "bg-amber-100", // Highlighted color
      isPopular: true,
      buttonStyle: "bg-zinc-900 text-white border-2 border-zinc-900 hover:bg-zinc-800",
      features: [
        "Unlimited boards",
        "Custom template creation",
        "30-day version history",
        "Export to PDF & SVG",
        "Priority email support",
        "Private guest links"
      ]
    },
    {
      target: "Business",
      name: "Team",
      price: "$49",
      billing: "flat rate / month",
      description: "For agencies and product teams scaling their collaboration.",
      color: "bg-white",
      buttonStyle: "bg-zinc-100 text-zinc-900 border-2 border-zinc-800 hover:bg-zinc-200",
      features: [
        "Everything in Pro",
        "Unlimited team members",
        "Unlimited version history",
        "SSO & Advanced Security",
        "Shared team workspaces",
        "24/7 dedicated support"
      ]
    }
  ];

  return (
    <div className="py-24 md:py-32 px-4 md:px-8 w-full font-poppins relative z-10 bg-secondarybackground border-t border-dashed border-zinc-400">
      
      {/* Section Header */}
      <div className="flex flex-col items-center text-center gap-4 mb-16 md:mb-24">
        <p className="text-sm font-poppins font-semibold text-zinc-500 uppercase tracking-widest">
          Simple Pricing
        </p>
        <h2 className="text-4xl md:text-5xl font-instrument text-zinc-800 tracking-tight max-w-2xl">
          Plans that scale <br className="hidden md:block" /> with your ideas.
        </h2>
        <p className="text-sm md:text-base text-zinc-600 max-w-md leading-relaxed">
          Whether you are sketching out a dorm room project or architecting an enterprise app, we have a plan for you.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-8 items-center px-4">
        {plans.map((plan, index) => (
          <div 
            key={index}
            className={`relative flex flex-col p-8 md:p-10 rounded-[32px] border-2 border-zinc-800 shadow-[8px_8px_0px_#27272a] transition-all duration-300 ${plan.color} ${plan.isPopular ? 'md:-mt-8 md:mb-8 z-20 shadow-[12px_12px_0px_#27272a]' : 'z-10 hover:-translate-y-2 hover:shadow-[12px_12px_0px_#27272a]'}`}
          >
            {/* Popular Badge */}
            {plan.isPopular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-xs font-bold uppercase tracking-widest py-1.5 px-4 rounded-full border-2 border-zinc-900">
                Most Popular
              </div>
            )}

            {/* Target Audience & Plan Name */}
            <p className="text-sm font-semibold text-zinc-500 mb-2">
              For {plan.target}
            </p>
            <h3 className="text-3xl font-instrument font-medium text-zinc-900 mb-6">
              {plan.name}
            </h3>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-5xl font-instrument font-medium text-zinc-900">
                {plan.price}
              </span>
              <span className="text-sm text-zinc-600 font-medium">
                {plan.billing}
              </span>
            </div>
            
            <p className="text-sm text-zinc-600 leading-relaxed mb-8 h-10">
              {plan.description}
            </p>

            {/* CTA Button */}
            <button className={`w-full py-3 rounded-xl font-semibold text-sm transition-colors duration-200 mb-8 ${plan.buttonStyle}`}>
              Get Started
            </button>

            {/* Features List */}
            <div className="flex flex-col gap-4 mt-auto">
              <p className="text-sm font-semibold text-zinc-900 mb-2 border-b-2 border-zinc-800/10 pb-2">
                What's included:
              </p>
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  {/* Custom Checkmark */}
                  <div className="mt-0.5 w-5 h-5 rounded-full bg-green-200 border border-green-600 flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-zinc-700 font-medium">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};

export default Pricing;