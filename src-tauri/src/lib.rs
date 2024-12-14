#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use rusqlite::{Connection, Result};
mod db;
use db::{add_user, delete_user, get_users, init_db, update_user, User};
use tauri::{Builder, generate_handler, generate_context};


#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! vvvvvvvvvvvvvvvvvvt!", name)
}

#[tauri::command]
async fn init_database() -> Result<String, String> {
    match init_db() {
        Ok(_) => Ok("Tables créées avec succès!".to_string()),
        Err(e) => Err(format!("Erreur lors de la création des tables: {}", e)),
    }
}

#[tauri::command]
async fn get_all_users() -> Result<Vec<User>, String> {
    match init_db() {
        Ok(mut conn) => {
            get_users(&mut conn)
                .map_err(|e| e.to_string())
        }
        Err(e) => Err(format!("Erreur de connexion à la base de données: {}", e)),
    }
}

#[tauri::command]
async fn add_new_user(user: User) -> Result<String, String> {
    println!("Reçu les données de l'utilisateur : {:?}", user);

    match init_db() {
        Ok(mut conn) => {
            match add_user(&mut conn, &user) {
                Ok(id) => Ok(format!("Utilisateur ajouté avec ID: {}", id)),
                Err(e) => {
                    println!("Erreur lors de l'ajout de l'utilisateur : {}", e);
                    Err(format!("Erreur lors de l'ajout de l'utilisateur: {}", e))
                }
            }
        }
        Err(e) => Err(format!("Erreur de connexion à la base de données : {}", e)),
    }
}

#[tauri::command]
async fn delete_existing_user(id: i64) -> Result<(), String> {
    match init_db() {
        Ok(mut conn) => {
            delete_user(&mut conn, &id.to_string())
                .map_err(|e| e.to_string())
        }
        Err(e) => Err(format!("Erreur de connexion à la base de données : {}", e)),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    println!("Hello, my name is Mohammed!");
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())  // Plugin pour l'accès shell (si nécessaire)
        .invoke_handler(tauri::generate_handler![
            greet,
            add_new_user,             // Commande pour ajouter un utilisateur
            get_all_users,            // Commande pour obtenir tous les utilisateurs// Commande pour mettre à jour un utilisateur
            delete_existing_user      // Commande pour supprimer un utilisateur
        ])  // Ajout de toutes les commandes dans le handler
        .run(tauri::generate_context!())
        .expect("Error while running Tauri application");
}
