import { ArrowRight } from 'lucide-react';
import Button from './Button';

export default function Hero() {
  return (
    <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero content */}
          <div className="space-y-8">
            <div className="inline-block">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-900 text-white">
                New Collection 2026
              </span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Elevate Your Style with Premium Fashion
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed">
              Discover our curated collection of timeless pieces that blend sophistication with modern design.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="flex items-center gap-2">
                Shop Now
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg">
                View Catalog
              </Button>
            </div>

            {/* Stats display */}
            <div className="flex gap-8 pt-8">
              <div>
                <p className="text-3xl font-bold text-gray-900">500+</p>
                <p className="text-sm text-gray-600">Premium Products</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">50K+</p>
                <p className="text-sm text-gray-600">Happy Customers</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">4.9</p>
                <p className="text-sm text-gray-600">Average Rating</p>
              </div>
            </div>
          </div>

          {/* Hero image */}
          <div className="relative lg:h-[600px] hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 rounded-3xl transform rotate-3"></div>
            <img
              src="https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Fashion Model"
              className="absolute inset-0 w-full h-full object-cover rounded-3xl shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -z-10 transform translate-x-1/2 -translate-y-1/2">
        <div className="w-96 h-96 bg-slate-200 rounded-full opacity-20 blur-3xl"></div>
      </div>
      <div className="absolute bottom-0 left-0 -z-10 transform -translate-x-1/2 translate-y-1/2">
        <div className="w-96 h-96 bg-slate-200 rounded-full opacity-20 blur-3xl"></div>
      </div>
    </div>
  );
}
