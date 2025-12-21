-- Update existing companies to have random 4-digit suffix for security
UPDATE companies 
SET subdomain = subdomain || '-' || floor(1000 + random() * 9000)::text 
WHERE subdomain NOT LIKE '%-%';