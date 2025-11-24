import { Job, JobType, Project, Application, Education, Experience } from './types';

export const MOCK_JOBS: Job[] = [
  {
    id: '1',
    title: 'Senior React Engineer',
    company: 'TechFlow Solutions',
    location: 'Remote',
    type: JobType.FULL_TIME,
    salaryRange: '$120k - $160k',
    description: 'We are looking for an experienced React developer to lead our frontend team. You will be responsible for architecting scalable UI components and mentoring junior developers.',
    requirements: ['React', 'TypeScript', 'Node.js', 'AWS'],
    postedAt: '2 days ago',
    logoUrl: 'https://ui-avatars.com/api/?name=TechFlow&background=random',
    applicantsCount: 12
  },
  {
    id: '2',
    title: 'Product Designer',
    company: 'Creative Gigs',
    location: 'New York, NY',
    type: JobType.FULL_TIME,
    salaryRange: '$90k - $130k',
    description: 'Join our award-winning design team. We need someone with a keen eye for detail and a passion for user-centric design principles.',
    requirements: ['Figma', 'UI/UX', 'Prototyping', 'HTML/CSS'],
    postedAt: '4 hours ago',
    logoUrl: 'https://ui-avatars.com/api/?name=Creative+Gigs&background=random',
    applicantsCount: 45
  },
  {
    id: '3',
    title: 'Backend Developer',
    company: 'DataCorp',
    location: 'San Francisco, CA',
    type: JobType.CONTRACT,
    salaryRange: '$80/hr',
    description: 'Help us build robust APIs and microservices. You should have experience with high-load systems and database optimization.',
    requirements: ['Python', 'Django', 'PostgreSQL', 'Redis'],
    postedAt: '1 day ago',
    logoUrl: 'https://ui-avatars.com/api/?name=DataCorp&background=random',
    applicantsCount: 8
  },
  {
    id: '4',
    title: 'Marketing Specialist',
    company: 'GrowthHackers',
    location: 'Austin, TX',
    type: JobType.PART_TIME,
    salaryRange: '$30k - $45k',
    description: 'We need a creative marketer to manage our social media channels and run ad campaigns.',
    requirements: ['SEO', 'Content Marketing', 'Google Analytics'],
    postedAt: '3 days ago',
    logoUrl: 'https://ui-avatars.com/api/?name=GrowthHackers&background=random',
    applicantsCount: 23
  }
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    description: 'A full-stack e-commerce platform with features like product management, shopping cart, and payment integration.',
    technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
    imageUrl: 'https://picsum.photos/id/20/400/200',
    stats: { views: 1200, likes: 45, comments: 12 }
  },
  {
    id: '2',
    title: 'Task Management App',
    description: 'A collaborative task management application with real-time updates and team collaboration features.',
    technologies: ['Vue.js', 'Firebase', 'Tailwind CSS'],
    imageUrl: 'https://picsum.photos/id/24/400/200',
    stats: { views: 850, likes: 32, comments: 8 }
  },
  {
    id: '3',
    title: 'Data Visualization Dashboard',
    description: 'An interactive dashboard for visualizing complex data sets with real-time updates and custom filters.',
    technologies: ['Python', 'D3.js', 'Flask', 'PostgreSQL'],
    imageUrl: 'https://picsum.photos/id/26/400/200',
    stats: { views: 1500, likes: 67, comments: 15 }
  }
];

export const MOCK_APPLICATIONS: Application[] = [
  {
    id: '1',
    jobId: '1',
    jobTitle: 'Senior Software Engineer',
    companyName: 'Tech Solutions Inc.',
    status: 'Interview',
    appliedDate: '2024-03-15'
  },
  {
    id: '2',
    jobId: '2',
    jobTitle: 'Product Manager',
    companyName: 'Innovate Corp',
    status: 'Pending',
    appliedDate: '2024-03-20'
  },
  {
    id: '3',
    jobId: '3',
    jobTitle: 'Frontend Developer',
    companyName: 'WebWorks',
    status: 'Rejected',
    appliedDate: '2024-02-10'
  }
];

export const MOCK_EXPERIENCE: Experience[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    startDate: '2021-06-01',
    endDate: '',
    current: true,
    description: 'Leading the frontend team in migration to React. Improved performance by 40%.'
  },
  {
    id: '2',
    title: 'Web Developer',
    company: 'StartUp Alpha',
    startDate: '2019-01-01',
    endDate: '2021-05-31',
    current: false,
    description: 'Developed and maintained client websites using HTML, CSS, and JavaScript.'
  }
];

export const MOCK_EDUCATION: Education[] = [
  {
    id: '1',
    degree: 'B.S. Computer Science',
    institution: 'University of Tech',
    startDate: '2015-09-01',
    endDate: '2019-05-20',
    description: 'Graduated with Honors. specialized in Artificial Intelligence.'
  }
];

export const JOB_TYPES = Object.values(JobType);
