// 
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::result::Result;
mod db;
use tauri;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! vvvvvvvvvvvvvvvvvvt!", name)
}


fn main() {
    // Vérifiez la connexion à la base de données
    // Lancez votre application Tauri
    gym_app_lib::run();
}