export default function PropertyGallery({
  property,
}) {
  return (
    <div className="rounded-3xl overflow-hidden">
      <img
        src={
          property.images?.[0] ||
          "/placeholder.jpg"
        }
        alt={property.title}
        className="w-full h-[500px] object-cover"
      />
    </div>
  );
}
