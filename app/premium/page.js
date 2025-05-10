'use client';

import Link from 'next/link';

export default function PremiumPage() {
  return (
    <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-12 pb-20 space-y-12">
      <h1 className="text-3xl md:text-4xl font-extrabold text-black text-center mb-10">
        Upgrade to Premium
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Basic Plan */}
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-2 text-black">Basic</h2>
          <p className="text-gray-600 text-sm mb-4">Limited Access</p>
          <p className="text-2xl font-extrabold text-black mb-4">Free</p>
          <ul className="text-sm text-gray-700 space-y-2 mb-6">
            <li>✓ Free access to first chapter</li>
            <li>✓ Job board and profile access</li>
            <li>✓ Completion certificates</li>
          </ul>
          <button className="w-full border border-black text-black py-2 rounded-md font-semibold hover:bg-gray-100">
            Start Free
          </button>
        </div>

        {/* Premium Plan */}
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-2 text-black">Premium</h2>
          <p className="text-gray-600 text-sm mb-4">For individuals</p>
          <p className="text-3xl font-extrabold text-black mb-1">€13<span className="text-base font-normal">/month</span></p>
          <p className="text-xs text-gray-600 mb-4">Billed annually</p>
          <ul className="text-sm text-gray-700 space-y-2 mb-6">
            <li>✓ Full access to all content</li>
            <li>✓ Projects and certifications</li>
            <li>✓ Career-ready paths</li>
            <li>✓ Access to Python, SQL, Power BI, and more</li>
          </ul>
          <button className="w-full bg-black text-white py-2 rounded-md font-semibold hover:bg-gray-800">
            Subscribe Now
          </button>
        </div>

        {/* Teams Plan */}
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-2 text-black">Teams</h2>
          <p className="text-gray-600 text-sm mb-4">For groups of 2+</p>
          <p className="text-2xl font-extrabold text-black mb-1">€13<span className="text-base font-normal">/user</span></p>
          <p className="text-xs text-gray-600 mb-4">Billed annually</p>
          <ul className="text-sm text-gray-700 space-y-2 mb-6">
            <li>✓ Everything in Premium</li>
            <li>✓ Team management tools</li>
            <li>✓ Activity tracking and licenses</li>
          </ul>
          <button className="w-full border border-black text-black py-2 rounded-md font-semibold hover:bg-gray-100">
            Configure Team
          </button>
        </div>
      </div>

      <div className="text-center">
        <Link href="/" className="text-sm text-gray-600 hover:underline">Volver al inicio</Link>
      </div>
    </main>
  );
}
