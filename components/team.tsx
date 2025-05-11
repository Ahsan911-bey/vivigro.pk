import Image from 'next/image';

interface TeamMember {
  name: string;
  role: string;
  image: string;
  description: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Rai Hassan",
    role: "CEO & Founder",
    image: "/CEO.jpg",
    description: "Passionate about sustainable agriculture and bringing fresh produce to communities."
  },
  {
    name: "Atif Ameer Daula",
    role: "Sales Manager",
    image: "/salesmanager2.jpg",
    description: "Responsible for leading our sales team, developing strategies to drive revenue growth, building strong client relationships, and ensuring customer satisfaction"
  },
  {
    name: "Shakeela",
    role: "Product Development Manager",
    image: "/Productmanagement.jpg",
    description: "Responsible for driving the innovation and creation of new products, defining product strategy, managing the development process, and ensuring successful product launches."
  },
  {
    name: "Alisha Dilsher Ali ",
    role: "Sales Manager",
    image: "/DigitalMediaSpecialist.jpg",
    description: "Responsible for creating engaging video and photo content, conducting interviews, and optimizing digital media to enhance brand presence and audience connection."
  }
];

export default function Team() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-gray-100">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
              <div className="relative h-64 w-full">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">{member.name}</h3>
                <p className="text-green-600 dark:text-green-400 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 dark:text-gray-300">{member.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 