// Prevents additional console window on Windows in release, DO NOT REMOVE!!
 #![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::result::Result;
mod db;
use tauri;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! vvvvvvvvvvvvvvvvvvt!", name)
}
fn main() {
gym_app_lib::run();
    //tauri::Builder::default()
      //  .invoke_handler(tauri::generate_handler![greet])
        //.run(tauri::generate_context!())
        //.expect("error while running Tauri application");
//if let Err(e) = db::init_db() {
  //      eprintln!("Erreur lors de la création de la table: {}", e);
  //  } 
//print!("Hello from!");
   
}
