use wasm_bindgen::prelude::*;
use web_sys::*;

#[wasm_bindgen]
pub struct Vector {
    pub x: f64,
    pub y: f64,
}

#[wasm_bindgen]
impl Vector {
    #[wasm_bindgen(constructor)]
    pub fn new(x: f64, y: f64) -> Vector {
        Vector { x, y }
    }

    pub fn log(&self) {
        web_sys::console::log_1(&format!("x: {}, y: {}", self.x, self.y).into());
    }
}
