#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod db;
use tauri;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! vvvvvvvvvvvvvvvvvvt!", name)
}

fn main() {
    gym_app_lib::run();
}