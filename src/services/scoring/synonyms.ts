// Synonym groups for enhanced keyword matching
// Each group contains terms that are semantically equivalent for ATS purposes

const SYNONYM_GROUPS: string[][] = [
  // Leadership & Management
  ['leadership', 'led', 'managed', 'directed', 'oversaw', 'headed', 'spearheaded'],
  ['team management', 'people management', 'team leadership', 'staff management'],
  ['project management', 'program management', 'portfolio management'],
  ['strategic planning', 'strategy development', 'strategic thinking'],
  ['mentoring', 'coaching', 'mentorship', 'training'],

  // Communication
  ['communication', 'interpersonal', 'verbal communication', 'written communication'],
  ['collaboration', 'teamwork', 'cross-functional', 'cross-team'],
  ['presentation', 'public speaking', 'presenting'],
  ['stakeholder management', 'stakeholder engagement', 'client relations'],

  // Data & Analytics
  ['data analysis', 'data analytics', 'analytical', 'data-driven'],
  ['data visualization', 'reporting', 'dashboards', 'data reporting'],
  ['statistical analysis', 'statistics', 'statistical modeling'],
  ['business intelligence', 'bi', 'business analytics'],
  ['big data', 'large-scale data', 'data engineering'],
  ['etl', 'data pipeline', 'data integration', 'data processing'],

  // Software Development
  ['software development', 'software engineering', 'application development'],
  ['full stack', 'full-stack', 'fullstack'],
  ['front end', 'front-end', 'frontend'],
  ['back end', 'back-end', 'backend'],
  ['web development', 'web engineering', 'web applications'],
  ['mobile development', 'mobile engineering', 'mobile applications'],
  ['api development', 'api design', 'rest api', 'restful api', 'api integration'],
  ['microservices', 'micro-services', 'service-oriented architecture', 'soa'],
  ['object-oriented', 'oop', 'object oriented programming'],
  ['test-driven development', 'tdd', 'test driven development'],
  ['version control', 'git', 'source control'],

  // Cloud & Infrastructure
  ['cloud computing', 'cloud infrastructure', 'cloud services'],
  ['devops', 'dev ops', 'site reliability', 'sre'],
  ['containerization', 'docker', 'containers'],
  ['orchestration', 'kubernetes', 'k8s'],
  ['infrastructure as code', 'iac', 'terraform', 'cloudformation'],
  ['monitoring', 'observability', 'logging', 'alerting'],

  // Databases
  ['sql', 'structured query language', 'relational database'],
  ['nosql', 'non-relational database', 'document database'],
  ['database management', 'database administration', 'dba'],

  // AI & ML
  ['machine learning', 'ml', 'predictive modeling'],
  ['deep learning', 'neural networks', 'dl'],
  ['artificial intelligence', 'ai'],
  ['natural language processing', 'nlp', 'text analytics'],
  ['computer vision', 'image recognition', 'cv'],

  // Design & UX
  ['user experience', 'ux', 'ux design'],
  ['user interface', 'ui', 'ui design'],
  ['user research', 'usability testing', 'ux research'],
  ['wireframing', 'prototyping', 'mockups'],
  ['responsive design', 'mobile-first', 'adaptive design'],

  // Project & Process
  ['agile', 'scrum', 'agile methodology'],
  ['kanban', 'lean', 'lean methodology'],
  ['sprint planning', 'backlog grooming', 'backlog refinement'],
  ['continuous improvement', 'process improvement', 'optimization'],
  ['requirements gathering', 'requirements analysis', 'business requirements'],
  ['problem solving', 'problem-solving', 'troubleshooting', 'debugging'],
  ['critical thinking', 'analytical thinking', 'logical thinking'],

  // Security
  ['cybersecurity', 'information security', 'infosec', 'cyber security'],
  ['security audit', 'vulnerability assessment', 'penetration testing'],
  ['compliance', 'regulatory compliance', 'governance'],
  ['risk management', 'risk assessment', 'risk analysis'],

  // Marketing & Business
  ['digital marketing', 'online marketing', 'internet marketing'],
  ['seo', 'search engine optimization'],
  ['sem', 'search engine marketing', 'paid search'],
  ['content marketing', 'content strategy', 'content creation'],
  ['crm', 'customer relationship management'],
  ['erp', 'enterprise resource planning'],
  ['roi', 'return on investment'],
  ['kpi', 'key performance indicator', 'key performance indicators'],
  ['budget management', 'financial planning', 'cost management'],
  ['vendor management', 'supplier management', 'third-party management'],

  // Certifications & Frameworks
  ['pmp', 'project management professional'],
  ['aws certified', 'aws certification'],
  ['scrum master', 'csm', 'certified scrum master'],
  ['six sigma', 'lean six sigma'],
  ['itil', 'it service management', 'itsm'],

  // General skills
  ['time management', 'prioritization', 'multitasking'],
  ['attention to detail', 'detail-oriented', 'detail oriented', 'meticulous'],
  ['self-motivated', 'self-starter', 'proactive', 'initiative'],
  ['adaptability', 'flexibility', 'adaptable'],
  ['documentation', 'technical writing', 'technical documentation'],
]

// Build reverse lookup: term → all synonyms in its group
const SYNONYM_MAP = new Map<string, Set<string>>()

for (const group of SYNONYM_GROUPS) {
  const normalized = group.map((t) => t.toLowerCase())
  const groupSet = new Set(normalized)
  for (const term of normalized) {
    // Merge with existing group if term appears in multiple groups
    const existing = SYNONYM_MAP.get(term)
    if (existing) {
      for (const s of groupSet) existing.add(s)
      // Update all members to point to the merged set
      for (const s of existing) SYNONYM_MAP.set(s, existing)
    } else {
      SYNONYM_MAP.set(term, groupSet)
    }
  }
}

export function getSynonyms(keyword: string): Set<string> | undefined {
  return SYNONYM_MAP.get(keyword.toLowerCase())
}
