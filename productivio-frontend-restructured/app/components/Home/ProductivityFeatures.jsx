import React from "react";

const features = [
  {
    title: "Todo List",
    description: "Organize everything in your life with structured task lists. Whether it's work projects, personal tasks, or study plans, TickTick helps you organize and confidently tackle everything in your life.",
    image: "/assets/todo-list.jpg",
    textAlign: "left",
  },
  {
    title: "Pomodoro Technique",
    description: "Track time and stay focused. Adopt the popular - Pomodoro Technique. Break tasks into 25-minute intervals to stay focused and achieve a productive flow.",
    image: "/assets/pomodoro.jpg",
    textAlign: "right",
  },
  {
    title: "Eisenhower Matrix",
    description: "Focus on important and urgent tasks. Different strategies for different matrix. Edit filters to create a customized perspective. Effective plans guide the sequence of actions.",
    image: "/assets/eisenhower-matrix.png",
    textAlign: "left",
  },
];

const ProductivityFeatures = () => {
  return (
    <section className="px-5 py-16 bg-gradient-to-r from-blue-100 to-blue-200">
      <div className="container mx-auto flex flex-col gap-16">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`relative flex flex-col md:flex-row items-center gap-10 rounded-lg overflow-hidden shadow-lg bg-white p-8 ${
              feature.textAlign === "right" ? "md:flex-row-reverse" : ""
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0 opacity-5">
              <img
                src={feature.image}
                alt={feature.title}
                className="object-cover w-full h-full"
              />
            </div>

            {/* Image Section */}
            <div className="relative ml-10 mr-10 md:w-1/3">
              <img
                src={feature.image}
                alt={feature.title}
                className="w-full rounded-lg shadow-lg"
              />
            </div>

            {/* Text Section */}
            <div className="relative md:w-2/3 text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-800">{feature.title}</h2>
              <p className="text-gray-600 mt-2 text-lg">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductivityFeatures;
