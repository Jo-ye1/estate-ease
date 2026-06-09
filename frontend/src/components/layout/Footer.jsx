export default function Footer() {
  return (
    <footer className="border-t mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16">

        <div className="grid md:grid-cols-4 gap-10">

          <div>
            <h2 className="text-2xl font-bold text-blue-500">
              Estate Ease
            </h2>

            <p className="mt-4 text-muted-foreground">
              Find your dream property with
              confidence.
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-4">
              Company
            </h3>

            <ul className="space-y-2">
              <li>About</li>
              <li>Contact</li>
              <li>Blog</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">
              Properties
            </h3>

            <ul className="space-y-2">
              <li>Buy</li>
              <li>Rent</li>
              <li>Sell</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">
              Support
            </h3>

            <ul className="space-y-2">
              <li>FAQ</li>
              <li>Help Center</li>
              <li>Privacy Policy</li>
            </ul>
          </div>

        </div>

        <div className="border-t mt-12 pt-6 text-center text-muted-foreground">
          © 2026 Estate Ease. All rights reserved.
        </div>
      </div>
    </footer>
  );
}