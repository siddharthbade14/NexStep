// Comprehensive LinkedIn-style Onboarding Master Datasets for NexStep

export const COLLEGES_AND_UNIVERSITIES = [
  { name: 'Delhi Technological University (DTU)', city: 'New Delhi', state: 'Delhi', tier: 'Tier 1' },
  { name: 'Indian Institute of Technology Bombay (IITB)', city: 'Mumbai', state: 'Maharashtra', tier: 'Tier 1' },
  { name: 'Indian Institute of Technology Delhi (IITD)', city: 'New Delhi', state: 'Delhi', tier: 'Tier 1' },
  { name: 'Indian Institute of Technology Madras (IITM)', city: 'Chennai', state: 'Tamil Nadu', tier: 'Tier 1' },
  { name: 'Indian Institute of Technology Kharagpur (IITKGP)', city: 'Kharagpur', state: 'West Bengal', tier: 'Tier 1' },
  { name: 'Indian Institute of Technology Kanpur (IITK)', city: 'Kanpur', state: 'Uttar Pradesh', tier: 'Tier 1' },
  { name: 'Indian Institute of Technology Roorkee (IITR)', city: 'Roorkee', state: 'Uttarakhand', tier: 'Tier 1' },
  { name: 'BITS Pilani (Pilani Campus)', city: 'Pilani', state: 'Rajasthan', tier: 'Tier 1' },
  { name: 'BITS Pilani (Goa Campus)', city: 'Zuarinagar', state: 'Goa', tier: 'Tier 1' },
  { name: 'BITS Pilani (Hyderabad Campus)', city: 'Hyderabad', state: 'Telangana', tier: 'Tier 1' },
  { name: 'Netaji Subhas University of Technology (NSUT)', city: 'New Delhi', state: 'Delhi', tier: 'Tier 1' },
  { name: 'National Institute of Technology Trichy (NITT)', city: 'Tiruchirappalli', state: 'Tamil Nadu', tier: 'Tier 1' },
  { name: 'National Institute of Technology Karnataka (NITK Surathkal)', city: 'Surathkal', state: 'Karnataka', tier: 'Tier 1' },
  { name: 'National Institute of Technology Warangal (NITW)', city: 'Warangal', state: 'Telangana', tier: 'Tier 1' },
  { name: 'National Institute of Technology Rourkela (NITR)', city: 'Rourkela', state: 'Odisha', tier: 'Tier 1' },
  { name: 'National Institute of Technology Calicut (NITC)', city: 'Calicut', state: 'Kerala', tier: 'Tier 1' },
  { name: 'Motilal Nehru National Institute of Technology (MNNIT Allahabad)', city: 'Prayagraj', state: 'Uttar Pradesh', tier: 'Tier 1' },
  { name: 'Malaviya National Institute of Technology (MNIT Jaipur)', city: 'Jaipur', state: 'Rajasthan', tier: 'Tier 1' },
  { name: 'Visvesvaraya National Institute of Technology (VNIT Nagpur)', city: 'Nagpur', state: 'Maharashtra', tier: 'Tier 1' },
  { name: 'International Institute of Information Technology Hyderabad (IIIT-H)', city: 'Hyderabad', state: 'Telangana', tier: 'Tier 1' },
  { name: 'International Institute of Information Technology Bangalore (IIIT-B)', city: 'Bengaluru', state: 'Karnataka', tier: 'Tier 1' },
  { name: 'Indraprastha Institute of Information Technology Delhi (IIIT-Delhi)', city: 'New Delhi', state: 'Delhi', tier: 'Tier 1' },
  { name: 'Vellore Institute of Technology (VIT Vellore)', city: 'Vellore', state: 'Tamil Nadu', tier: 'Tier 2' },
  { name: 'Vellore Institute of Technology (VIT Chennai)', city: 'Chennai', state: 'Tamil Nadu', tier: 'Tier 2' },
  { name: 'Manipal Institute of Technology (MIT Manipal)', city: 'Manipal', state: 'Karnataka', tier: 'Tier 2' },
  { name: 'Thapar Institute of Engineering and Technology', city: 'Patiala', state: 'Punjab', tier: 'Tier 2' },
  { name: 'PSG College of Technology', city: 'Coimbatore', state: 'Tamil Nadu', tier: 'Tier 2' },
  { name: 'College of Engineering, Pune (COEP Tech)', city: 'Pune', state: 'Maharashtra', tier: 'Tier 2' },
  { name: 'Veermata Jijabai Technological Institute (VJTI)', city: 'Mumbai', state: 'Maharashtra', tier: 'Tier 2' },
  { name: 'Jadavpur University, Faculty of Engineering', city: 'Kolkata', state: 'West Bengal', tier: 'Tier 2' },
  { name: 'Savitribai Phule Pune University (SPPU affiliated colleges)', city: 'Pune', state: 'Maharashtra', tier: 'State Univ' },
  { name: 'Dr. A.P.J. Abdul Kalam Technical University (AKTU affiliated colleges)', city: 'Lucknow', state: 'Uttar Pradesh', tier: 'State Univ' },
  { name: 'Anna University (CEG Campus & Affiliates)', city: 'Chennai', state: 'Tamil Nadu', tier: 'State Univ' },
  { name: 'Visvesvaraya Technological University (VTU Belagavi)', city: 'Belagavi', state: 'Karnataka', tier: 'State Univ' },
  { name: 'Jawaharlal Nehru Technological University (JNTU Hyderabad)', city: 'Hyderabad', state: 'Telangana', tier: 'State Univ' },
  { name: 'Jawaharlal Nehru Technological University (JNTU Kakinada)', city: 'Kakinada', state: 'Andhra Pradesh', tier: 'State Univ' },
  { name: 'Gujarat Technological University (GTU Ahmedabad)', city: 'Ahmedabad', state: 'Gujarat', tier: 'State Univ' },
  { name: 'Mumbai University (MU Affiliated Engineering)', city: 'Mumbai', state: 'Maharashtra', tier: 'State Univ' },
  { name: 'Rajasthan Technical University (RTU Kota)', city: 'Kota', state: 'Rajasthan', tier: 'State Univ' },
  { name: 'IK Gujral Punjab Technical University (IKGPTU)', city: 'Jalandhar', state: 'Punjab', tier: 'State Univ' },
  { name: 'SRM Institute of Science and Technology (KTR Campus)', city: 'Chennai', state: 'Tamil Nadu', tier: 'Tier 2' },
  { name: 'Shiv Nadar University (SNU Greater Noida)', city: 'Greater Noida', state: 'Uttar Pradesh', tier: 'Tier 2' },
  { name: 'BMS College of Engineering (BMSCE)', city: 'Bengaluru', state: 'Karnataka', tier: 'Tier 2' },
  { name: 'M. S. Ramaiah Institute of Technology (MSRIT)', city: 'Bengaluru', state: 'Karnataka', tier: 'Tier 2' },
  { name: 'RV College of Engineering (RVCE)', city: 'Bengaluru', state: 'Karnataka', tier: 'Tier 2' },
  { name: 'PES University (RR Campus)', city: 'Bengaluru', state: 'Karnataka', tier: 'Tier 2' },
  { name: 'Dayananda Sagar College of Engineering (DSCE)', city: 'Bengaluru', state: 'Karnataka', tier: 'Tier 3' },
  { name: 'Chandigarh University (CU Mohali)', city: 'Mohali', state: 'Punjab', tier: 'Tier 3' },
  { name: 'Lovely Professional University (LPU Phagwara)', city: 'Phagwara', state: 'Punjab', tier: 'Tier 3' },
  { name: 'Amity University (Noida Campus)', city: 'Noida', state: 'Uttar Pradesh', tier: 'Tier 3' },
  { name: 'Kalinga Institute of Industrial Technology (KIIT)', city: 'Bhubaneswar', state: 'Odisha', tier: 'Tier 2' },
  { name: 'Siksha O Anusandhan (SOA ITER)', city: 'Bhubaneswar', state: 'Odisha', tier: 'Tier 3' },
  { name: 'MIT World Peace University (MIT-WPU)', city: 'Pune', state: 'Maharashtra', tier: 'Tier 2' },
  { name: 'Vishwakarma Institute of Technology (VIT Pune)', city: 'Pune', state: 'Maharashtra', tier: 'Tier 2' },
  { name: 'Pimpri Chinchwad College of Engineering (PCCOE)', city: 'Pune', state: 'Maharashtra', tier: 'Tier 3' },
  { name: 'Cummins College of Engineering for Women', city: 'Pune', state: 'Maharashtra', tier: 'Tier 2' },
  { name: 'Sardar Patel Institute of Technology (SPIT)', city: 'Mumbai', state: 'Maharashtra', tier: 'Tier 2' },
  { name: 'Dwarkadas J. Sanghvi College of Engineering (DJSCE)', city: 'Mumbai', state: 'Maharashtra', tier: 'Tier 2' },
  { name: 'K. J. Somaiya College of Engineering', city: 'Mumbai', state: 'Maharashtra', tier: 'Tier 2' },
  { name: 'Government College of Technology (GCT Coimbatore)', city: 'Coimbatore', state: 'Tamil Nadu', tier: 'Tier 2' },
  { name: 'Thiagarajar College of Engineering (TCE Madurai)', city: 'Madurai', state: 'Tamil Nadu', tier: 'Tier 2' },
  { name: 'Chaitanya Bharathi Institute of Technology (CBIT)', city: 'Hyderabad', state: 'Telangana', tier: 'Tier 2' },
  { name: 'Vasavi College of Engineering (VCE)', city: 'Hyderabad', state: 'Telangana', tier: 'Tier 2' },
  { name: 'VNR Vignana Jyothi Institute of Engineering (VNRVJIET)', city: 'Hyderabad', state: 'Telangana', tier: 'Tier 2' },
  { name: 'Gokaraju Rangaraju Institute of Engineering (GRIET)', city: 'Hyderabad', state: 'Telangana', tier: 'Tier 3' },
  { name: 'University Institute of Engineering and Technology (UIET Panjab Univ)', city: 'Chandigarh', state: 'Chandigarh', tier: 'Tier 2' },
  { name: 'Guru Gobind Singh Indraprastha University (GGSIPU Affiliates)', city: 'New Delhi', state: 'Delhi', tier: 'State Univ' },
  { name: 'Maharaja Agrasen Institute of Technology (MAIT)', city: 'New Delhi', state: 'Delhi', tier: 'Tier 2' },
  { name: 'Bharati Vidyapeeth College of Engineering (BVCOE)', city: 'New Delhi', state: 'Delhi', tier: 'Tier 3' },
  { name: 'Bhagwan Parshuram Institute of Technology (BPIT)', city: 'New Delhi', state: 'Delhi', tier: 'Tier 3' },
  { name: 'Jaypee Institute of Information Technology (JIIT Noida)', city: 'Noida', state: 'Uttar Pradesh', tier: 'Tier 2' },
  { name: 'Galgotias College of Engineering & Technology', city: 'Greater Noida', state: 'Uttar Pradesh', tier: 'Tier 3' },
  { name: 'JSS Academy of Technical Education (JSSATE Noida)', city: 'Noida', state: 'Uttar Pradesh', tier: 'Tier 3' },
  { name: 'KIET Group of Institutions (Ghaziabad)', city: 'Ghaziabad', state: 'Uttar Pradesh', tier: 'Tier 3' },
  { name: 'Ajay Kumar Garg Engineering College (AKGEC)', city: 'Ghaziabad', state: 'Uttar Pradesh', tier: 'Tier 3' },
  { name: 'Heritage Institute of Technology (HIT Kolkata)', city: 'Kolkata', state: 'West Bengal', tier: 'Tier 2' },
  { name: 'Institute of Engineering and Management (IEM Kolkata)', city: 'Kolkata', state: 'West Bengal', tier: 'Tier 2' }
];

export const DEGREE_PROGRAMS = [
  'B.Tech (Bachelor of Technology)',
  'B.E. (Bachelor of Engineering)',
  'Dual Degree B.Tech + M.Tech (5-Year)',
  'M.Tech (Master of Technology)',
  'BCA (Bachelor of Computer Applications)',
  'MCA (Master of Computer Applications)',
  'B.Sc Computer Science / IT',
  'M.Sc Data Science / CS',
  'Diploma in Engineering (Polytechnic)'
];

export const ENGINEERING_STREAMS = [
  { id: 'B.Tech CSE', name: 'Computer Science & Engineering (CSE)', code: 'CSE', category: 'Computing' },
  { id: 'B.Tech AI-ML', name: 'Artificial Intelligence & Machine Learning (AI & ML)', code: 'AIML', category: 'Computing' },
  { id: 'B.Tech Data-Science', name: 'Data Science & Big Data Engineering', code: 'DS', category: 'Computing' },
  { id: 'B.Tech IT', name: 'Information Technology (IT)', code: 'IT', category: 'Computing' },
  { id: 'B.Tech Cyber-Security', name: 'Cyber Security & Forensics', code: 'CS', category: 'Computing' },
  { id: 'B.Tech ECE', name: 'Electronics & Communication Engineering (ECE)', code: 'ECE', category: 'Circuit' },
  { id: 'B.Tech EEE', name: 'Electrical & Electronics Engineering (EEE)', code: 'EEE', category: 'Circuit' },
  { id: 'B.Tech Embedded-IoT', name: 'IoT & Embedded Systems Engineering', code: 'IoT', category: 'Circuit' },
  { id: 'B.Tech Mechanical', name: 'Mechanical Engineering (Automation & Robotics)', code: 'MECH', category: 'Core' },
  { id: 'B.Tech Mechatronics', name: 'Mechatronics & Robotics Systems', code: 'ROBO', category: 'Interdisciplinary' },
  { id: 'B.Tech Math-Computing', name: 'Mathematics & Scientific Computing', code: 'M&C', category: 'Computing' },
  { id: 'B.Tech Civil', name: 'Civil Engineering (Smart Infrastructure & GIS)', code: 'CIVIL', category: 'Core' },
  { id: 'B.Tech Chemical', name: 'Chemical Engineering & Process Control', code: 'CHEM', category: 'Core' },
  { id: 'B.Tech Biotech', name: 'Biotechnology & Computational Biology', code: 'BIOTECH', category: 'Interdisciplinary' }
];

export const DOMAINS_OF_INTEREST = [
  { id: 'fullstack', name: 'Full-Stack & Web Engineering', icon: 'Code', desc: 'Modern reactive web apps, production APIs, cloud microservices' },
  { id: 'ai_ml', name: 'Artificial Intelligence & Machine Learning', icon: 'Brain', desc: 'LLMs, embeddings, deep learning, computer vision, PyTorch' },
  { id: 'data_engineering', name: 'Data Science, Big Data & Analytics', icon: 'Database', desc: 'SQL pipelines, ETL, Pandas, PowerBI, quantitative metrics' },
  { id: 'devops_cloud', name: 'Cloud Infrastructure, DevOps & SRE', icon: 'Cloud', desc: 'Docker, Kubernetes, AWS, CI/CD pipelines, high availability' },
  { id: 'embedded_iot', name: 'Embedded Systems, IoT & Firmware', icon: 'Cpu', desc: 'Microcontrollers, ARM Cortex, FreeRTOS, hardware buses (UART/SPI)' },
  { id: 'cybersecurity', name: 'Cyber Security & Network Defense', icon: 'Shield', desc: 'Penetration testing, cryptographic auth, OWASP, zero-trust' },
  { id: 'mobile_dev', name: 'Mobile App Development (iOS & Android)', icon: 'Smartphone', desc: 'React Native, Flutter, Swift, Kotlin, high-performance UI' },
  { id: 'fintech_quant', name: 'FinTech & Quantitative Engineering', icon: 'TrendingUp', desc: 'High-frequency systems, payment gateways, risk algorithms' },
  { id: 'web3_blockchain', name: 'Blockchain, Web3 & Smart Contracts', icon: 'Boxes', desc: 'Solidity, EVM, decentralized consensus, cryptographic proofs' },
  { id: 'systems_os', name: 'Systems Programming & OS Architecture', icon: 'Terminal', desc: 'Linux kernel, C++, Rust, concurrent memory management' }
];

export const EXPANDED_TARGET_ROLES = [
  { 
    id: 'Software Developer', 
    title: 'Software Developer (Backend & Full-Stack)', 
    badge: 'Most Popular', 
    avg_salary: '₹8.5 - 18 LPA',
    domain: 'fullstack',
    skills: ['Python', 'FastAPI', 'React', 'Docker', 'PostgreSQL', 'Git']
  },
  { 
    id: 'Frontend Engineer', 
    title: 'Frontend Engineer (React / Next.js / UI)', 
    badge: 'High Demand', 
    avg_salary: '₹7.5 - 16 LPA',
    domain: 'fullstack',
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'State Management']
  },
  { 
    id: 'Data Analyst', 
    title: 'Data Analyst & Analytics Engineer', 
    badge: 'Rapid Growth', 
    avg_salary: '₹6.5 - 14 LPA',
    domain: 'data_engineering',
    skills: ['SQL', 'Pandas', 'Python', 'PowerBI', 'Tableau', 'Statistics']
  },
  { 
    id: 'Machine Learning Engineer', 
    title: 'Machine Learning & AI Engineer', 
    badge: 'Deep Tech', 
    avg_salary: '₹10.0 - 24 LPA',
    domain: 'ai_ml',
    skills: ['Python', 'PyTorch', 'Hugging Face', 'Scikit-Learn', 'Vector DBs']
  },
  { 
    id: 'Cloud & DevOps Engineer', 
    title: 'DevOps & Cloud Platform Engineer', 
    badge: 'High CTC', 
    avg_salary: '₹9.0 - 20 LPA',
    domain: 'devops_cloud',
    skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux', 'Terraform']
  },
  { 
    id: 'Embedded Systems Engineer', 
    title: 'Embedded Systems & Firmware Engineer', 
    badge: 'Hardware / IoT', 
    avg_salary: '₹7.0 - 16 LPA',
    domain: 'embedded_iot',
    skills: ['Embedded C', 'FreeRTOS', 'ARM Cortex', 'UART/SPI/I2C', 'Hardware Debug']
  },
  { 
    id: 'Cyber Security Analyst', 
    title: 'Cyber Security & Vulnerability Analyst', 
    badge: 'Critical Need', 
    avg_salary: '₹8.0 - 18 LPA',
    domain: 'cybersecurity',
    skills: ['Network Security', 'Linux', 'OWASP Top 10', 'Wireshark', 'Python Scripting']
  },
  { 
    id: 'Mobile App Developer', 
    title: 'Mobile App Developer (Flutter / React Native)', 
    badge: 'Mobile Core', 
    avg_salary: '₹7.0 - 15 LPA',
    domain: 'mobile_dev',
    skills: ['React Native', 'Flutter', 'TypeScript', 'Mobile APIs', 'Firebase']
  },
  { 
    id: 'Quantitative Developer', 
    title: 'Quantitative FinTech Engineer', 
    badge: 'Elite Tier', 
    avg_salary: '₹14.0 - 32 LPA',
    domain: 'fintech_quant',
    skills: ['C++', 'Python', 'Algorithms', 'Probability', 'Time Series Analysis']
  },
  { 
    id: 'Data Engineer', 
    title: 'Big Data & Pipeline Engineer', 
    badge: 'High Scale', 
    avg_salary: '₹9.5 - 22 LPA',
    domain: 'data_engineering',
    skills: ['Apache Spark', 'SQL', 'Python', 'Kafka', 'Airflow', 'Data Warehousing']
  }
];

export const MASTER_SKILLS_DATABASE = [
  // Programming Languages
  { name: 'Python', category: 'Language', popular: true },
  { name: 'JavaScript', category: 'Language', popular: true },
  { name: 'TypeScript', category: 'Language', popular: true },
  { name: 'C++', category: 'Language', popular: true },
  { name: 'Java', category: 'Language', popular: true },
  { name: 'C', category: 'Language', popular: false },
  { name: 'Go (Golang)', category: 'Language', popular: true },
  { name: 'Rust', category: 'Language', popular: true },
  { name: 'Kotlin', category: 'Language', popular: false },
  { name: 'Swift', category: 'Language', popular: false },
  { name: 'SQL', category: 'Language', popular: true },
  { name: 'Bash / Shell Scripting', category: 'Language', popular: false },
  { name: 'Solidity', category: 'Language', popular: false },

  // Web & Backend Frameworks
  { name: 'React', category: 'Web Framework', popular: true },
  { name: 'Next.js', category: 'Web Framework', popular: true },
  { name: 'Node.js', category: 'Backend', popular: true },
  { name: 'Express.js', category: 'Backend', popular: true },
  { name: 'FastAPI', category: 'Backend', popular: true },
  { name: 'Django', category: 'Backend', popular: false },
  { name: 'Spring Boot', category: 'Backend', popular: true },
  { name: 'RESTful APIs', category: 'Backend', popular: true },
  { name: 'GraphQL', category: 'Backend', popular: false },
  { name: 'Tailwind CSS', category: 'Web Framework', popular: true },
  { name: 'WebSockets', category: 'Backend', popular: false },
  { name: 'Microservices Architecture', category: 'Architecture', popular: true },

  // Data, AI & Machine Learning
  { name: 'Data Structures & Algorithms (DSA)', category: 'Core CS', popular: true },
  { name: 'Machine Learning', category: 'AI & Data', popular: true },
  { name: 'Deep Learning', category: 'AI & Data', popular: false },
  { name: 'Pandas', category: 'AI & Data', popular: true },
  { name: 'NumPy', category: 'AI & Data', popular: true },
  { name: 'PyTorch', category: 'AI & Data', popular: true },
  { name: 'TensorFlow', category: 'AI & Data', popular: false },
  { name: 'Scikit-Learn', category: 'AI & Data', popular: true },
  { name: 'Natural Language Processing (NLP)', category: 'AI & Data', popular: false },
  { name: 'Computer Vision (OpenCV)', category: 'AI & Data', popular: false },
  { name: 'Hugging Face & LLMs', category: 'AI & Data', popular: true },
  { name: 'PowerBI', category: 'AI & Data', popular: true },
  { name: 'Tableau', category: 'AI & Data', popular: false },
  { name: 'Apache Spark', category: 'AI & Data', popular: false },

  // Cloud, DevOps & Systems
  { name: 'Docker', category: 'DevOps', popular: true },
  { name: 'Kubernetes', category: 'DevOps', popular: true },
  { name: 'AWS (Amazon Web Services)', category: 'Cloud', popular: true },
  { name: 'Google Cloud Platform (GCP)', category: 'Cloud', popular: false },
  { name: 'Microsoft Azure', category: 'Cloud', popular: false },
  { name: 'CI/CD Pipelines', category: 'DevOps', popular: true },
  { name: 'Git & GitHub', category: 'Tools', popular: true },
  { name: 'Linux / Unix OS', category: 'Core CS', popular: true },
  { name: 'Operating Systems Concepts', category: 'Core CS', popular: true },
  { name: 'System Design & Scalability', category: 'Architecture', popular: true },

  // Databases & Storage
  { name: 'PostgreSQL', category: 'Database', popular: true },
  { name: 'MySQL', category: 'Database', popular: true },
  { name: 'MongoDB', category: 'Database', popular: true },
  { name: 'Redis Caching', category: 'Database', popular: true },
  { name: 'DBMS Relational Modeling', category: 'Core CS', popular: true },
  { name: 'Elasticsearch', category: 'Database', popular: false },
  { name: 'Kafka / Event Streaming', category: 'Backend', popular: true },

  // Embedded & Hardware
  { name: 'Embedded C', category: 'Embedded', popular: true },
  { name: 'FreeRTOS Concurrency', category: 'Embedded', popular: true },
  { name: 'ARM Cortex Architecture', category: 'Embedded', popular: true },
  { name: 'UART / SPI / I2C Bus Protocols', category: 'Embedded', popular: true },
  { name: 'Microcontroller Programming (STM32 / ESP32)', category: 'Embedded', popular: true },
  { name: 'Hardware Circuit Debugging', category: 'Embedded', popular: false },
  { name: 'Verilog / FPGA Design', category: 'Embedded', popular: false },
  { name: 'PCB Layout & Schematics', category: 'Embedded', popular: false }
];

export const GRADUATION_YEARS = [2024, 2025, 2026, 2027, 2028, 2029];

export const PREFERRED_WORK_MODES = [
  { id: 'hybrid', label: 'Hybrid (Office + Remote)' },
  { id: 'remote', label: 'Remote / Work From Home' },
  { id: 'onsite', label: 'On-site / In-Office' }
];

export const INDIAN_TECH_HUBS = [
  'Bengaluru (Bangalore)',
  'Hyderabad',
  'Pune',
  'Delhi NCR (Gurgaon / Noida / Delhi)',
  'Mumbai / Navi Mumbai',
  'Chennai',
  'Anywhere in India'
];
