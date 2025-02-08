import React from "react";

const features = [
  {
    title: "Todo List",
    description: "Organize everything in your life with structured task lists.",
    image: "/assets/todo-list.jpg",
    textAlign: "left",
  }, 
  {
    title: "Pomodoro Technique",
    description: "Boost focus with timed work and break sessions.",
    image: "/assets/pomodoro.jpg",
    textAlign: "right",
  },
  {
    title: "Eisenhower Matrix",
    description: "Prioritize tasks effectively based on urgency & importance.",
    image: "/assets/eisenhower-matrix.png",
    textAlign: "left",
  },
];

const ProductivityFeatures = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto flex flex-col gap-12">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`flex flex-col md:flex-row items-center gap-10 ${
              feature.textAlign === "right" ? "md:flex-row-reverse" : ""
            }`}
          >
            {/* Image Section */}
            <div className="md:w-1/2">
              <img
                src={feature.image}
                alt={feature.title}
                className="w-full rounded-lg shadow-lg"
              />
            </div>

            {/* Text Section */}
            <div className="md:w-1/2 text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-800">{feature.title}</h2>
              <p className="text-gray-600 mt-4">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductivityFeatures;
