export interface ResumeBullet {
  id: string
  text: string
  sectionName: string
}

export interface ResumeSection {
  name: string
  content: string
  bullets: ResumeBullet[]
}

export interface Resume {
  rawText: string
  sections: ResumeSection[]
  bullets: ResumeBullet[]
}
