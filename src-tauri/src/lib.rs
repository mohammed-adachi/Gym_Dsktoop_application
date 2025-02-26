#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use rusqlite::Connection;
use std::sync::Mutex;
use tauri::State;

mod db;
use db::{add_user, delete_user, get_users, init_db, update_user, User, get_userParId ,user_histId, UserHistory, update_form_user};

// État global pour stocker la connexion à la base de données
struct AppState {
    db: Mutex<Connection>,
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! vvvvvvvvvvvvvvvvvvt!", name)
}

#[tauri::command]
async fn init_database(state: State<'_, AppState>) -> Result<String, String> {
    let conn = state.db.lock().unwrap();
    match init_db(&conn) {
        Ok(_) => Ok("Tables créées avec succès!".to_string()),
        Err(e) => Err(format!("Erreur lors de la création des tables: {}", e)),
    }
}

#[tauri::command]
async fn get_all_users(state: State<'_, AppState>) -> Result<Vec<User>, String> {
    let conn = state.db.lock().unwrap();
    get_users(&conn).map_err(|e| e.to_string())
}

#[tauri::command]
async fn add_new_user(user: User, state: State<'_, AppState>) -> Result<String, String> {
    let conn = state.db.lock().unwrap();
    match add_user(&conn, &user) {
        Ok(_) => Ok("Utilisateur ajouté avec succès".to_string()),
        Err(e) => Err(format!("Erreur lors de l'ajout de l'utilisateur: {}", e)),
    }
}
#[tauri::command]
async fn get_userID(id: String, state: State<'_, AppState>) -> Result<User, String> {
    let conn = state.db.lock().unwrap();
    get_userParId(&conn, &id).map_err(|e| e.to_string())
}

#[tauri::command]
async fn updat_user(user: User, state: State<'_, AppState>) -> Result<(), String> {
    let conn = state.db.lock().unwrap();
    update_user(&conn, &user).map_err(|e| e.to_string())
}

#[tauri::command]
async fn delete_existing_user(id: String, state: State<'_, AppState>) -> Result<(), String> {
    let conn = state.db.lock().unwrap();
    delete_user(&conn, &id).map_err(|e| e.to_string())
}
#[tauri::command]
async fn user_historyId(id: String, state: State<'_, AppState>) -> Result<Vec<UserHistory>, String> {
    let conn = state.db.lock().unwrap();
    let user_histories = user_histId(&conn, &id).map_err(|e| e.to_string())?;
    Ok(user_histories)
}
#[tauri::command]
async fn update_form_use(user: User, state: State<'_, AppState>) -> Result<(), String> {
    let conn = state.db.lock().unwrap();
    update_form_user(&conn, &user).map_err(|e| e.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    println!("Hello, my name is Mohammed!");

    // Initialisation de la base de données
    let conn = Connection::open("gym_management.db").expect("Failed to open database");

    // Initialisation des tables
    init_db(&conn).expect("Failed to initialize database");

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .manage(AppState {
            db: Mutex::new(conn),
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            add_new_user,
            updat_user,
            get_all_users,
            get_userID,
            delete_existing_user,
            user_historyId,
            update_form_use
        ])
        .run(tauri::generate_context!())
        .expect("Error while running Tauri application");
}