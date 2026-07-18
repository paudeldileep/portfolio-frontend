/**
 * Portfolio Backend — Canonical TypeScript Interfaces
 * ─────────────────────────────────────────────────────
 * These mirror the Supabase `portfolio_content` JSON document structure
 * returned by GET /content and the chat contract for POST /chat.
 *
 * When the backend schema changes, update here first — all consuming
 * apps in the monorepo will surface TypeScript errors immediately.
 */

// ── Profile ────────────────────────────────────────────────────
export interface Profile {
  title: string;
  summary: string[];
}

// ── Skills ─────────────────────────────────────────────────────
export type SkillCategory =
  | 'frontend_engineering'
  | 'frontend_architecture_accessibility'
  | 'performance_dev_experience'
  | 'backend_apis'
  | 'cloud_devops'
  | 'testing_quality'
  | 'databases'
  | 'security'
  | 'ai_emerging_tech';

export type Skills = Record<SkillCategory, string[]>;

// ── Experience ─────────────────────────────────────────────────
export interface Experience {
  company: string;
  role: string;
  location: string | null;
  start_date: string;
  end_date: string;
  type: 'experience';
  summary: string;
  highlights: string[];
}

// ── Education ──────────────────────────────────────────────────
export interface Education {
  degree: string;
  institution: string | null;
  cgpa: string;
  type: 'education';
}

// ── Certification ──────────────────────────────────────────────
export interface Certification {
  name: string;
  issuer: string;
  type: 'certification';
}

// ── Canonical Portfolio Document ───────────────────────────────
export interface PortfolioContent {
  profile: Profile;
  skills: Skills;
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
}

// ── Chat ───────────────────────────────────────────────────────
export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  reply: string;
}

// ── API Result Wrapper ─────────────────────────────────────────
export type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };
