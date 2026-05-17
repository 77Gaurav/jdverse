export interface Skill {
  id: string;
  label: string;
  category: string;
}

const skills: Skill[] = [
  // ── Computer Science Core ──
  { id: "data-structures", label: "Data Structures", category: "programming" },
  { id: "algorithms", label: "Algorithms", category: "programming" },
  { id: "oop", label: "OOP", category: "programming" },
  
  // ── Programming Languages (Newer → Legacy) ──
  { id: "rust", label: "Rust", category: "programming" },
  { id: "go", label: "Go", category: "programming" },
  { id: "kotlin", label: "Kotlin", category: "programming" },
  { id: "swift", label: "Swift", category: "programming" },
  { id: "typescript", label: "TypeScript", category: "programming" },
  { id: "python", label: "Python", category: "programming" },
  { id: "java", label: "Java", category: "programming" },
  { id: "javascript", label: "JavaScript", category: "programming" },
  { id: "cpp", label: "C++", category: "programming" },
  { id: "php", label: "PHP", category: "programming" },
  { id: "c", label: "C", category: "programming" },



  // ── Frontend (Newer → Legacy) ──
  { id: "nextjs", label: "Next.js", category: "frontend" },
  { id: "react", label: "React", category: "frontend" },
  { id: "vue", label: "Vue", category: "frontend" },
  { id: "angular", label: "Angular", category: "frontend" },
  { id: "tailwind", label: "Tailwind CSS", category: "frontend" },
  { id: "bootstrap", label: "Bootstrap", category: "frontend" },
  { id: "html5", label: "HTML5", category: "frontend" },
  { id: "css", label: "CSS", category: "frontend" },

  // ── Backend (Newer → Legacy) ──
  { id: "nodejs", label: "Node.js", category: "backend" },
  { id: "express", label: "Express", category: "backend" },
  { id: "django", label: "Django", category: "backend" },
  { id: "flask", label: "Flask", category: "backend" },
  { id: "springboot", label: "Spring Boot", category: "backend" },
  { id: "aspnet", label: "ASP.NET", category: "backend" },
  { id: "laravel", label: "Laravel", category: "backend" },

  // ── Databases (Newer → Legacy) ──
  { id: "supabase", label: "Supabase", category: "database" },
  { id: "firebase", label: "Firebase", category: "database" },
  { id: "dynamodb", label: "DynamoDB", category: "database" },
  { id: "mongodb", label: "MongoDB", category: "database" },
  { id: "redis", label: "Redis", category: "database" },
  { id: "cassandra", label: "Cassandra", category: "database" },
  { id: "postgresql", label: "PostgreSQL", category: "database" },
  { id: "mariadb", label: "MariaDB", category: "database" },
  { id: "mysql", label: "MySQL", category: "database" },
  { id: "sqlite", label: "SQLite", category: "database" },

  // ── Cloud Platforms (Newer → Legacy) ──
  { id: "vercel", label: "Vercel", category: "cloud" },
  { id: "aws", label: "AWS", category: "cloud" },
  { id: "gcp", label: "GCP", category: "cloud" },
  { id: "azure", label: "Azure", category: "cloud" },

  // ── Tools & DevOps (Newer → Legacy) ──
  { id: "kubernetes", label: "Kubernetes", category: "tools" },
  { id: "docker", label: "Docker", category: "tools" },
  { id: "linux", label: "Linux", category: "tools" },
  { id: "git", label: "Git", category: "tools" },
  { id: "nginx", label: "Nginx", category: "tools" },
  { id: "figma", label: "Figma", category: "tools" },
  { id: "postman", label: "Postman", category: "tools" },
  { id: "jira", label: "Jira", category: "tools" },
  { id: "vscode", label: "VS Code", category: "tools" },
];

export default skills;
