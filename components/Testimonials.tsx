import React from 'react';
import Card from './Card';
import { QuoteIcon } from './IconComponents';
import { TESTIMONIALS } from '../constants';

const SectionHeader: React.FC<{ title: string; subtitle?: string }> = ({ title, subtitle }) => (
  <div className="text-center mb-10">
    <h2 className="text-3xl font-bold text-royal-blue mb-2">{title}</h2>
    {subtitle && <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>}
  </div>
);

const Testimonials: React.FC = () => (
    <section>
        <SectionHeader title="Success Stories from Our Learners" subtitle="Hear from our alumni who have transformed their careers with Saumya Path." />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((testimonial, index) => (
                <Card key={index} className="p-6 flex flex-col">
                    <QuoteIcon className="w-8 h-8 text-royal-blue/20 mb-4" />
                    <p className="text-gray-600 mb-6 flex-grow">"{testimonial.quote}"</p>
                    <div className="flex items-center">
                        <img loading="lazy" src={testimonial.avatarUrl} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4" />
                        <div>
                            <p className="font-bold text-royal-blue">{testimonial.name}</p>
                            <p className="text-sm text-gray-500">{testimonial.course}</p>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    </section>
);

export default Testimonials;