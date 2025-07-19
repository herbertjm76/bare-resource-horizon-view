-- Create storage bucket for videos
INSERT INTO storage.buckets (id, name, public) VALUES ('videos', 'videos', true);

-- Create policies for video uploads
CREATE POLICY "Anyone can view videos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'videos');

CREATE POLICY "Authenticated users can upload videos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'videos' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update their videos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'videos' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete videos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'videos' AND auth.role() = 'authenticated');