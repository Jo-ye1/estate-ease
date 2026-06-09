export default function ContactAgentForm() {
  return (
    <div className="mt-12">

      <h2 className="text-2xl font-bold mb-6">
        Contact Agent
      </h2>

      <div className="space-y-4">

        <input
          placeholder="Your Name"
          className="w-full border rounded-xl p-3"
        />

        <input
          placeholder="Email"
          className="w-full border rounded-xl p-3"
        />

        <textarea
          rows="5"
          placeholder="Message"
          className="w-full border rounded-xl p-3"
        />

        <button className="bg-blue-600 text-white px-6 py-3 rounded-xl">
          Send Message
        </button>

      </div>

    </div>
  );
}