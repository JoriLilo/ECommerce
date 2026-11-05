import { Link } from 'react-router-dom';


export default function HomePage() {
  return (
    <div className="bg-[#FFF9FC] text-[#2E0F32]">
     

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="mb-2 font-serif text-3xl">Explore categories</h2>
        <p className="mb-8 text-gray-500">
          Find exactly what you're looking for.
        </p>

        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          <Link to="/products" className="group">
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500"
              alt="Fashion"
              className="h-48 w-full object-cover"
            />
            <h3 className="mt-3 font-semibold group-hover:text-[#A66A9A]">
              Fashion
            </h3>
          </Link>

          <Link to="/products" className="group">
            <img
              src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500"
              alt="Electronics"
              className="h-48 w-full object-cover"
            />
            <h3 className="mt-3 font-semibold group-hover:text-[#A66A9A]">
              Electronics
            </h3>
          </Link>

          <Link to="/products" className="group">
            <img
              src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=500"
              alt="Home and living"
              className="h-48 w-full object-cover"
            />
            <h3 className="mt-3 font-semibold group-hover:text-[#A66A9A]">
              Home 
            </h3>
          </Link>

          <Link to="/products" className="group">
            <img
              src="https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500"
              alt="Accessories"
              className="h-48 w-full object-cover"
            />
            <h3 className="mt-3 font-semibold group-hover:text-[#A66A9A]">
              Accessories
            </h3>
          </Link>
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-[#F8F0F6] py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-serif text-3xl">Featured products</h2>

            <Link
              to="/products"
              className="text-sm font-semibold underline hover:text-[#A66A9A]"
            >
              View all
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            <div>
              <img
                src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500"
                alt="Shoulder bag"
                className="h-56 w-full object-cover"
              />
              <h3 className="mt-3 font-semibold">Everyday Shoulder Bag</h3>
              <p className="mt-1 text-[#A66A9A]">€49.99</p>
            </div>

            <div>
              <img
                src="https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=500"
                alt="Ceramic vase"
                className="h-56 w-full object-cover"
              />
              <h3 className="mt-3 font-semibold">Minimal Ceramic Vase</h3>
              <p className="mt-1 text-[#A66A9A]">€28.50</p>
            </div>

            <div>
              <img
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"
                alt="Sneakers"
                className="h-56 w-full object-cover"
              />
              <h3 className="mt-3 font-semibold">Classic Sneakers</h3>
              <p className="mt-1 text-[#A66A9A]">€74.99</p>
            </div>

            <div>
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"
                alt="Headphones"
                className="h-56 w-full object-cover"
              />
              <h3 className="mt-3 font-semibold">Wireless Headphones</h3>
              <p className="mt-1 text-[#A66A9A]">€89.00</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom banner */}
      <section className="bg-[#2E0F32] px-6 py-16 text-center text-white">
        <h2 className="mb-4 font-serif text-3xl md:text-4xl">
          Your next favorite find is here.
        </h2>

        <p className="mb-8 text-[#C98BB9]">
          Discover products from sellers you'll love.
        </p>

        <Link
          to="/products"
          className="inline-block bg-[#B7F34A] px-8 py-3 font-semibold text-[#2E0F32] hover:bg-[#C8FF69]"
        >
          Explore products
        </Link>
      </section>
    </div>
  );
}