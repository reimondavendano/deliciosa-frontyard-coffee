import { supabase, STORAGE_BUCKET } from './supabase';

export async function uploadImage(
    file: File,
    folder: string
): Promise<string | null> {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${folder}/${fileName}`;

        const { error } = await supabase.storage
            .from(STORAGE_BUCKET)
            .upload(filePath, file);

        if (error) {
            console.error('Upload error:', error);
            return null;
        }

        // Get public URL
        const { data } = supabase.storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(filePath);

        return data.publicUrl;
    } catch (error) {
        console.error('Upload error:', error);
        return null;
    }
}

export async function deleteImage(imageUrl: string): Promise<boolean> {
    try {
        // Extract path from URL
        const url = new URL(imageUrl);
        const pathParts = url.pathname.split('/');
        const bucketIndex = pathParts.indexOf(STORAGE_BUCKET);
        if (bucketIndex === -1) return false;

        const filePath = pathParts.slice(bucketIndex + 1).join('/');

        const { error } = await supabase.storage
            .from(STORAGE_BUCKET)
            .remove([filePath]);

        if (error) {
            console.error('Delete error:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Delete error:', error);
        return false;
    }
}
