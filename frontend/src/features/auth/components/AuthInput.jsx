export default function AuthInput({
  label,
  type = "text",
  placeholder,
  value,
  onChange
}) {
  return (
    <div className="space-y-2 mb-5">
      <label className="block text-sm font-medium">
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="
  w-full
  py-3        {/* Cleaner vertical thickness */}
  px-4        {/* Standard horizontal gutter */}
  rounded-xl
  border
  bg-transparent
  outline-none
  focus:ring-2
  focus:ring-blue-500
"
      />
    </div>
  );
}
