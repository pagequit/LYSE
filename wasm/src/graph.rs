use crate::edge::Edge;
use crate::node::Node;
use wasm_bindgen::prelude::*;
use web_sys::js_sys::{Object, Reflect};

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    pub fn log(s: &str);
}

#[wasm_bindgen(js_name = createGraph)]
pub fn create_graph(nodes: Vec<Node>, edges: Vec<Edge>) -> Object {
    let graph = Object::new();
    for node in nodes {
        let neighbors: Vec<Node> = edges
            .iter()
            .filter_map(|edge| {
                if edge.a == node {
                    return Some(edge.b);
                }

                if edge.b == node {
                    return Some(edge.a);
                }

                None
            })
            .collect();

        if !neighbors.is_empty() {
            // FIXME
            // &node.into() results always in [object Object] as key
            let _ = Reflect::set(&graph, &node.into(), &neighbors.into());
        }
    }

    graph
}
