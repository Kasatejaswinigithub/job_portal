import React from 'react';
import { Job } from '../types';
import { MapPin, Clock, Briefcase, DollarSign } from 'lucide-react';

interface JobCardProps {
  job: Job;
  onClick: (id: string) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onClick }) => {
  return (
    <div 
      onClick={() => onClick(job.id)}
      className="group bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col md:flex-row gap-6 items-start md:items-center"
    >
      <div className="flex-shrink-0">
        <img 
          src={job.logoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&background=random`} 
          alt={`${job.company} logo`} 
          className="w-16 h-16 rounded-lg object-cover shadow-sm group-hover:scale-105 transition-transform"
        />
      </div>
      
      <div className="flex-1 w-full">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
              {job.title}
            </h3>
            <p className="text-slate-500 font-medium">{job.company}</p>
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-50 text-brand-700">
            {job.type}
          </span>
        </div>
        
        <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm text-slate-500 mt-3">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {job.location}
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4" />
            {job.salaryRange}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {job.postedAt}
          </div>
        </div>
      </div>

      <div className="hidden md:block">
        <button className="px-4 py-2 rounded-lg bg-slate-100 text-slate-600 font-medium hover:bg-brand-50 hover:text-brand-600 transition-colors">
          View Details
        </button>
      </div>
    </div>
  );
};
