-- Create view_requests table
CREATE TABLE IF NOT EXISTS view_requests (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL,
  project_title TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'viewed', 'contacted')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on project_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_view_requests_project_id ON view_requests(project_id);

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_view_requests_status ON view_requests(status);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_view_requests_created_at ON view_requests(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE view_requests ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (using service role key bypasses RLS)
CREATE POLICY "Allow all operations for service role"
  ON view_requests
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_view_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_view_requests_timestamp
  BEFORE UPDATE ON view_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_view_requests_updated_at();

