use crate::edge::Edge;
use crate::node::Node;
use wasm_bindgen::prelude::*;
use web_sys::js_sys::Map;

#[wasm_bindgen(typescript_custom_section)]
const GRAPH: &'static str = r#"
type Graph = Map<Node, Array<Node>>;
"#;

#[wasm_bindgen(js_name = createGraph)]
pub fn create_graph(nodes: Vec<Node>, edges: Vec<Edge>) -> Map {
    let graph = Map::new();
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
            graph.set(&node.into(), &neighbors.into());
        }
    }

    graph
}
