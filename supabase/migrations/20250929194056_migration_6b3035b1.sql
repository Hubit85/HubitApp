-- Crear el bucket 'uploads' en Supabase Storage
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'uploads',
  'uploads',
  true,
  52428800, -- 50MB en bytes
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
);

-- Crear políticas de seguridad para el bucket 'uploads'
-- Política para permitir subidas autenticadas
CREATE POLICY "Authenticated users can upload files" ON storage.objects
FOR INSERT 
WITH CHECK (
  bucket_id = 'uploads' 
  AND auth.role() = 'authenticated'
);

-- Política para permitir lectura pública
CREATE POLICY "Public read access for uploads" ON storage.objects
FOR SELECT 
USING (bucket_id = 'uploads');

-- Política para permitir que los usuarios actualicen sus propios archivos
CREATE POLICY "Users can update own files" ON storage.objects
FOR UPDATE 
USING (
  bucket_id = 'uploads' 
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'uploads' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Política para permitir que los usuarios eliminen sus propios archivos
CREATE POLICY "Users can delete own files" ON storage.objects
FOR DELETE 
USING (
  bucket_id = 'uploads' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);