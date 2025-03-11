import React from "react";

const features = [
  {
    title: "Todo List",
    description: "Whether it's work projects, personal tasks, or study plans, Productivio helps you organize and confidently tackle everything in your life.",
    heading: "Organize everything in your life",
    image: "/assets/todo-list.png",
    textAlign: "right",
  },
  {
    title: "Pomodoro Technique",
    description: "Adopt the popular - Pomodoro Technique. Break tasks into 25-minute intervals to stay focused and achieve a productive flow.",
    heading: "Track time and stay focused",
    image: "/assets/pomodoro.png",
    textAlign: "left",
  },
  {
    title: "Eisenhower Matrix",
    description: "Different strategies for different matrix. Edit filters to create a customized perspective. Effective plans guide the sequence of actions.",
    heading: "Divide tasks based on importance and priority",
    image: "/assets/eisenhower-matrix.png",
    textAlign: "right",
  },
];

const ProductivityFeatures = () => {
  return (
    <section className="xxl:p-28 lg:p-16 sm:px-6 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100">
      <div className="container mx-auto flex flex-col gap-16">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`relative flex xxl:flex-row xxl:items-center xxl:gap-12 xxl:p-12 xl:flex-row xl:items-center xl:gap-8 xl:p-8 xllg:flex-row xllg:gap-8 xllg:p-6 lg:flex-row lg:gap-4 lg:p-6 md:flex-col md:p-6 md:gap-4 rounded-2xl overflow-hidden shadow-2xl bg-white ${
              feature.textAlign === "left" ? "xxl:flex-row-reverse xl:flex-row-reverse xllg:flex-row-reverse lg:flex-row-reverse" : ""
            }`}
          >

            {/* Text Section */}
            <div className="flex-1">
              <div className="flex-col xxl:mt-10 xxl:mb-10 xxl:space-y-12 xl:mt-6 xl:mb-6 xl:space-y-8 xllg:mt-0 xllg:mb-0 xllg:space-y-2 lg:mt-0 lg:mb-4 lg:space-y-1">
                <p className="xxl:text-xl xl:text-lg xllg:text-md lg:text-md font-bold text-purple-800">{feature.title}</p>
                <h1 className="text-4xl xl:text-2xl xllg:text-2xl lg:text-lg font-bold text-purple-900">{feature.heading}</h1>
                <p className="text-purple-950 xxl:text-lg xl:text-sm xllg:text-sm lg:text-sm">{feature.description}</p>
              </div>
            </div>

            {/* Image Section */}
            <div className="flex-none flex xxl:justify-center xl:justify-center xllg:justify-center lg:justify-center">
              <img
                src={feature.image}
                alt={feature.title}
                className="xxl:w-[600px] xl:w-[500px] xllg:w-[500px] lg:w-[400px] md:w-full rounded-lg shadow-xl"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductivityFeatures;
