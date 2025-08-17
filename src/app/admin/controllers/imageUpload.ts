// app/actions/cloudinaryUpload.ts
"use server"; // Indique que ce fichier contient des Server Actions

// Assurez-vous d'importer votre fonction uploadToCloudinary correctement.
// Exemple : import { uploadToCloudinary } from '@/lib/cloudinary';
// Adaptez le chemin d'importation selon l'emplacement réel de votre fonction.
import { customAlphabet } from "nanoid"; // Pour un nom de fichier unique
import { uploader } from "../lib/cloudinaryConfig";

// Crée un générateur de chaîne de caractères unique et courte (par exemple, 10 caractères)
const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 10);

/**
 * Server Action pour uploader un fichier image vers Cloudinary.
 * Elle gère également l'application de votre watermark directement via Cloudinary.
 * @param formData FormData contenant le fichier à uploader sous la clé 'file'.
 * @returns Un objet avec 'success', 'imageUrl', 'publicId' en cas de succès,
 * ou 'success' et 'message' en cas d'erreur.
 */
export async function uploadGoodieImage(formData: FormData) {
  const file = formData.get("file") as File; // Récupère le fichier du FormData

  // Vérifie si un fichier a bien été envoyé
  if (!file) {
    return { success: false, message: "Aucun fichier fourni." };
  }

  // Vérifie le type de fichier (sécurité de base)
  if (!file.type.startsWith("image/")) {
    return { success: false, message: "Seules les images sont autorisées." };
  }

  // Vérifie la taille du fichier (ex: 5MB), important pour les Serverless Functions
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
  if (file.size > MAX_FILE_SIZE) {
    return {
      success: false,
      message: "La taille du fichier ne doit pas dépasser 5MB.",
    };
  }

  try {
    // Cloudinary peut prendre un 'Buffer' ou un 'Data URI (Base64)'
    // Pour un fichier provenant de FormData, il est souvent préférable d'utiliser un Buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64File = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Les options de transformation pour le watermark sont définies dans votre `uploader` original.
    // Il faut que `uploadToCloudinary` puisse les recevoir ou les gérer en interne.
    // Je vais adapter l'appel pour réutiliser votre logique existante `uploader`.
    // Si `uploader` attend un 'path' qui est une chaîne Base64, c'est ce que nous lui passerons.

    // Votre `uploader` applique déjà les transformations et le dossier.
    const result = (await uploader(base64File)) as {
      public_id: string;
      secure_url: string;
    };

    if (!result || !result.secure_url) {
      throw new Error("Cloudinary did not return a valid URL.");
    }

    // Retourne l'URL et le public_id pour le stockage en base de données
    return {
      success: true,
      imageUrl: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error: any) {
    console.error("Erreur lors de l'upload de l'image vers Cloudinary:", error);
    return {
      success: false,
      message: error.message || "Échec de l'upload de l'image.",
    };
  }
}
