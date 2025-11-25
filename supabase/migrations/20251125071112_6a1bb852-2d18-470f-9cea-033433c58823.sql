-- Allow unauthenticated users to view company basic info by subdomain (for join pages)
CREATE POLICY "Public can view company by subdomain for join pages"
ON companies
FOR SELECT
TO anon
USING (true);

-- Allow unauthenticated users to view pending invites by code (for validation)
CREATE POLICY "Public can view pending invites by code"
ON invites
FOR SELECT
TO anon
USING (status = 'pending');