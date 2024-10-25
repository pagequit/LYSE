use wasm_bindgen::prelude::*;

#[derive(Clone, Copy, PartialEq, Eq, Hash, Debug)]
#[wasm_bindgen]
pub struct Vector {
    pub x: i32,
    pub y: i32,
}

#[wasm_bindgen]
impl Vector {
    #[wasm_bindgen(constructor)]
    pub fn new(x: i32, y: i32) -> Vector {
        Vector { x, y }
    }
}
