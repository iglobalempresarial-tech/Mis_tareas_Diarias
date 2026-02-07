/*
  # Create Kanban Tasks Table

  1. New Tables
    - `tasks`
      - `id` (uuid, primary key)
      - `title` (text, task description)
      - `status` (text, one of: 'todo', 'in_progress', 'completed')
      - `position` (integer, for ordering within columns)
      - `created_at` (timestamptz, creation timestamp)
      - `updated_at` (timestamptz, last update timestamp)
  
  2. Security
    - Enable RLS on `tasks` table
    - Add policy for anyone to read all tasks (public app)
    - Add policy for anyone to insert tasks
    - Add policy for anyone to update tasks
    - Add policy for anyone to delete tasks
  
  3. Notes
    - Status field uses check constraint to ensure valid values
    - Position helps maintain order of tasks within each column
*/

CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  status text NOT NULL DEFAULT 'todo',
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN ('todo', 'in_progress', 'completed'))
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view tasks"
  ON tasks FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert tasks"
  ON tasks FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update tasks"
  ON tasks FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete tasks"
  ON tasks FOR DELETE
  USING (true);

CREATE INDEX IF NOT EXISTS tasks_status_position_idx ON tasks(status, position);