/*
  # Chat System Schema

  1. New Tables
    - `connections` - Stores partner connections
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `partner_id` (uuid, references auth.users)
      - `status` (text) - pending/accepted
      - `created_at` (timestamp)
      
    - `messages` - Stores chat messages
      - `id` (uuid, primary key)
      - `sender_id` (uuid, references auth.users)
      - `receiver_id` (uuid, references auth.users)
      - `content` (text)
      - `created_at` (timestamp)
      - `read` (boolean)

  2. Security
    - Enable RLS on both tables
    - Add policies for:
      - Users can only see their own connections
      - Users can only see messages they sent or received
*/

-- Create connections table
CREATE TABLE IF NOT EXISTS connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  partner_id uuid REFERENCES auth.users NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, partner_id)
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES auth.users NOT NULL,
  receiver_id uuid REFERENCES auth.users NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  read boolean DEFAULT false
);

-- Enable RLS
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Connections policies
CREATE POLICY "Users can view their own connections"
  ON connections
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = partner_id);

CREATE POLICY "Users can create connections"
  ON connections
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Messages policies
CREATE POLICY "Users can view their messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);