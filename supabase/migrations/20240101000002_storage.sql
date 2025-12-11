-- CivilOS Storage Buckets

-- Create bucket for ITP photos
insert into storage.buckets (id, name, public)
values ('itp-photos', 'itp-photos', false);

-- RLS for itp-photos bucket
create policy "Users can view photos from their organization"
  on storage.objects for select
  using (
    bucket_id = 'itp-photos'
    and public.get_user_organization_id() is not null
  );

create policy "Users can upload photos"
  on storage.objects for insert
  with check (
    bucket_id = 'itp-photos'
    and public.get_user_organization_id() is not null
  );

create policy "Users can update their uploaded photos"
  on storage.objects for update
  using (
    bucket_id = 'itp-photos'
    and public.get_user_organization_id() is not null
  );

create policy "Users can delete their uploaded photos"
  on storage.objects for delete
  using (
    bucket_id = 'itp-photos'
    and public.get_user_organization_id() is not null
  );
