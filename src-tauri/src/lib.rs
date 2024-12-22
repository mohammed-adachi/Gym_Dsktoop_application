#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use rusqlite::{Connection, Result};
mod db;
use db::{add_user, delete_user, get_users, init_db, update_user, User,get_user};
use tauri::{Builder, generate_handler, generate_context};


#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! vvvvvvvvvvvvvvvvvvt!", name)
}
fn connect_db() -> Result<Connection> {
    println!("Connexion à la base de données...");
    Connection::open("./gym_management.db")
}
#[tauri::command]
async fn init_database() -> Result<String, String> {
    match init_db() {
        Ok(_) => Ok("Tables créées avec succès!".to_string()),
        Err(e) => Err(format!("Erreur lors de la création des tables: {}", e)),
    }
}
#[tauri::command]
async fn init_database_once() -> Result<String, String> {
    static INIT: std::sync::Once = std::sync::Once::new();
    let mut init_result = Ok("Déjà initialisé.".to_string());

    INIT.call_once(|| {
        init_result = init_db().map(|_| "Tables créées avec succès!".to_string()).map_err(|e| e.to_string());
    });

    init_result
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
        Ok(conn) => {
            match add_user(&conn, &user) {
                Ok(_) => Ok("Utilisateur ajouté avec succès".to_string()), // Pas d'ID inclus ici
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
async fn updat_user(user: User) -> Result<(), String> {
    let conn = init_db().map_err(|e| e.to_string())?;
    update_user(&conn, &user).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
async fn delete_existing_user(id: String) -> Result<(), String> {
    match init_db() {
        Ok(mut conn) => {
            delete_user(&mut conn, &id)
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
            add_new_user, 
            updat_user,            // Commande pour ajouter un utilisateur
            get_all_users,            // Commande pour obtenir tous les utilisateurs// Commande pour mettre à jour un utilisateur
            delete_existing_user      // Commande pour supprimer un utilisateur
        ])  // Ajout de toutes les commandes dans le handler
        .run(tauri::generate_context!())
        .expect("Error while running Tauri application");
}
