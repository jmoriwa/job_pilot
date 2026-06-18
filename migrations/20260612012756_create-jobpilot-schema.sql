CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = pg_catalog, public, pg_temp
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text,
  phone text,
  location text,
  current_title text,
  experience_level text CHECK (
    experience_level IS NULL
    OR experience_level IN ('junior', 'mid', 'senior', 'lead')
  ),
  years_experience integer CHECK (
    years_experience IS NULL
    OR years_experience >= 0
  ),
  skills text[] NOT NULL DEFAULT '{}',
  industries text[] NOT NULL DEFAULT '{}',
  work_experience jsonb NOT NULL DEFAULT '[]'::jsonb,
  education jsonb NOT NULL DEFAULT '{}'::jsonb,
  job_titles_seeking text[] NOT NULL DEFAULT '{}',
  remote_preference text CHECK (
    remote_preference IS NULL
    OR remote_preference IN ('remote', 'onsite', 'hybrid', 'any')
  ),
  preferred_locations text[] NOT NULL DEFAULT '{}',
  salary_expectation text,
  cover_letter_tone text CHECK (
    cover_letter_tone IS NULL
    OR cover_letter_tone IN ('formal', 'casual', 'enthusiastic')
  ),
  linkedin_url text,
  portfolio_url text,
  work_authorization text CHECK (
    work_authorization IS NULL
    OR work_authorization IN ('citizen', 'permanent_resident', 'visa_required')
  ),
  resume_pdf_url text,
  resume_pdf_key text,
  is_complete boolean NOT NULL DEFAULT false,
  completion_percentage integer NOT NULL DEFAULT 0 CHECK (
    completion_percentage >= 0
    AND completion_percentage <= 100
  ),
  missing_fields text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.agent_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'running' CHECK (
    status IN ('running', 'completed', 'failed')
  ),
  job_title_searched text,
  location_searched text,
  jobs_found integer NOT NULL DEFAULT 0 CHECK (jobs_found >= 0),
  error_message text,
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id uuid REFERENCES public.agent_runs(id) ON DELETE SET NULL,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  source text NOT NULL CHECK (source IN ('search', 'url')),
  source_url text,
  external_apply_url text,
  title text NOT NULL,
  company text NOT NULL,
  location text,
  salary text,
  job_type text CHECK (
    job_type IS NULL
    OR job_type IN ('fulltime', 'parttime', 'contract')
  ),
  about_role text,
  responsibilities text[] NOT NULL DEFAULT '{}',
  requirements text[] NOT NULL DEFAULT '{}',
  nice_to_have text[] NOT NULL DEFAULT '{}',
  benefits text[] NOT NULL DEFAULT '{}',
  about_company text,
  match_score integer CHECK (
    match_score IS NULL
    OR (match_score >= 0 AND match_score <= 100)
  ),
  match_reason text,
  matched_skills text[] NOT NULL DEFAULT '{}',
  missing_skills text[] NOT NULL DEFAULT '{}',
  company_research jsonb,
  found_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.agent_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id uuid NOT NULL REFERENCES public.agent_runs(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message text NOT NULL,
  level text NOT NULL DEFAULT 'info' CHECK (
    level IN ('info', 'success', 'warning', 'error')
  ),
  job_id uuid REFERENCES public.jobs(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX profiles_is_complete_idx ON public.profiles(is_complete);
CREATE INDEX agent_runs_user_id_idx ON public.agent_runs(user_id);
CREATE INDEX agent_runs_user_started_at_idx ON public.agent_runs(user_id, started_at DESC);
CREATE INDEX agent_runs_status_idx ON public.agent_runs(status);
CREATE INDEX jobs_user_id_idx ON public.jobs(user_id);
CREATE INDEX jobs_run_id_idx ON public.jobs(run_id);
CREATE INDEX jobs_user_found_at_idx ON public.jobs(user_id, found_at DESC);
CREATE INDEX jobs_user_match_score_idx ON public.jobs(user_id, match_score DESC);
CREATE INDEX jobs_user_company_idx ON public.jobs(user_id, company);
CREATE INDEX agent_logs_user_id_idx ON public.agent_logs(user_id);
CREATE INDEX agent_logs_run_id_idx ON public.agent_logs(run_id);
CREATE INDEX agent_logs_user_created_at_idx ON public.agent_logs(user_id, created_at DESC);
CREATE INDEX agent_logs_job_id_idx ON public.agent_logs(job_id);

CREATE TRIGGER profiles_set_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER agent_runs_set_updated_at
BEFORE UPDATE ON public.agent_runs
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER jobs_set_updated_at
BEFORE UPDATE ON public.jobs
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_logs ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.profiles FROM anon, authenticated;
REVOKE ALL ON public.agent_runs FROM anon, authenticated;
REVOKE ALL ON public.jobs FROM anon, authenticated;
REVOKE ALL ON public.agent_logs FROM anon, authenticated;

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.agent_runs TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.jobs TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.agent_logs TO authenticated;

CREATE POLICY "profiles owners can select"
ON public.profiles
FOR SELECT
TO authenticated
USING (id = (SELECT auth.uid()));

CREATE POLICY "profiles owners can insert"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (id = (SELECT auth.uid()));

CREATE POLICY "profiles owners can update"
ON public.profiles
FOR UPDATE
TO authenticated
USING (id = (SELECT auth.uid()))
WITH CHECK (id = (SELECT auth.uid()));

CREATE POLICY "profiles owners can delete"
ON public.profiles
FOR DELETE
TO authenticated
USING (id = (SELECT auth.uid()));

CREATE POLICY "agent_runs owners can select"
ON public.agent_runs
FOR SELECT
TO authenticated
USING (user_id = (SELECT auth.uid()));

CREATE POLICY "agent_runs owners can insert"
ON public.agent_runs
FOR INSERT
TO authenticated
WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "agent_runs owners can update"
ON public.agent_runs
FOR UPDATE
TO authenticated
USING (user_id = (SELECT auth.uid()))
WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "agent_runs owners can delete"
ON public.agent_runs
FOR DELETE
TO authenticated
USING (user_id = (SELECT auth.uid()));

CREATE POLICY "jobs owners can select"
ON public.jobs
FOR SELECT
TO authenticated
USING (user_id = (SELECT auth.uid()));

CREATE POLICY "jobs owners can insert"
ON public.jobs
FOR INSERT
TO authenticated
WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "jobs owners can update"
ON public.jobs
FOR UPDATE
TO authenticated
USING (user_id = (SELECT auth.uid()))
WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "jobs owners can delete"
ON public.jobs
FOR DELETE
TO authenticated
USING (user_id = (SELECT auth.uid()));

CREATE POLICY "agent_logs owners can select"
ON public.agent_logs
FOR SELECT
TO authenticated
USING (user_id = (SELECT auth.uid()));

CREATE POLICY "agent_logs owners can insert"
ON public.agent_logs
FOR INSERT
TO authenticated
WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "agent_logs owners can update"
ON public.agent_logs
FOR UPDATE
TO authenticated
USING (user_id = (SELECT auth.uid()))
WITH CHECK (user_id = (SELECT auth.uid()));

CREATE POLICY "agent_logs owners can delete"
ON public.agent_logs
FOR DELETE
TO authenticated
USING (user_id = (SELECT auth.uid()));
