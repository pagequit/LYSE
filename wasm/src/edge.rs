use crate::node::Node;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Edge {
    pub a: Node,
    pub b: Node,
}

#[wasm_bindgen]
impl Edge {
    #[wasm_bindgen(constructor)]
    pub fn new(a: &Node, b: &Node) -> Edge {
        Edge { a: *a, b: *b }
    }
}
