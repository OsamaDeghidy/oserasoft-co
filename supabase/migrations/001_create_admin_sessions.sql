-- Create admin_sessions table for storing admin authentication sessions
CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on session_token for faster lookups
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(session_token);

-- Create index on expires_at for cleanup queries
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON admin_sessions(expires_at);

-- Enable Row Level Security (RLS)
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

-- Note: Since we're using SERVICE_ROLE_KEY in server-side operations,
-- RLS policies are bypassed automatically. This policy is for client-side access if needed.
CREATE POLICY "Allow service role operations"
  ON admin_sessions
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Function to automatically clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM admin_sessions
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Optional: Create a scheduled job to clean up expired sessions
-- This can be done via Supabase dashboard or pg_cron extension

