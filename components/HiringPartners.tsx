import React from 'react';
import { HIRING_PARTNERS } from '../constants';

const SectionHeader: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <div className="text-center mb-10">
    <h2 className="text-3xl font-bold text-royal-blue mb-2">{title}</h2>
    {subtitle && <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>}
  </div>
);

const HiringPartners: React.FC = () => (
    <section className="bg-gray-50 rounded-xl p-10">
        <SectionHeader title="Our Graduates Work At" subtitle="We partner with leading companies to create opportunities for our students." />
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-8 items-center">
            {HIRING_PARTNERS.map(partner => (
                <div key={partner.name} className="flex justify-center grayscale hover:grayscale-0 transition duration-300">
                    <img src={partner.logoUrl} alt={partner.name} className="h-10 object-contain" />
                </div>
            ))}
        </div>
    </section>
);

export default HiringPartners;
