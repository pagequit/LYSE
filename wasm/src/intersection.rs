use crate::vector::Vector;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Intersection {
    pub position: Vector,
    pub offset: f64,
}

#[wasm_bindgen]
impl Intersection {
    #[wasm_bindgen]
    pub fn find(a: &Vector, b: &Vector, c: &Vector, d: &Vector) -> Option<Intersection> {
        let t_top: i32 = (d.x - c.x) * (a.y - c.y) - (d.y - c.y) * (a.x - c.x);
        let u_top: i32 = (c.y - a.y) * (a.x - b.x) - (c.x - a.x) * (a.y - b.y);
        let bottom: i32 = (d.y - c.y) * (b.x - a.x) - (d.x - c.x) * (b.y - a.y);

        if bottom != 0 {
            let t: f64 = t_top as f64 / bottom as f64;
            let u: f64 = u_top as f64 / bottom as f64;
            if 0.0 <= t && t <= 1.0 && 0.0 <= u && u <= 1.0 {
                return Some(Intersection {
                    position: Vector::new(
                        lerp(a.x as f64, b.x as f64, t) as i32,
                        lerp(a.y as f64, b.y as f64, t) as i32,
                    ),
                    offset: t,
                });
            }
        }

        None
    }
}

fn lerp(a: f64, b: f64, t: f64) -> f64 {
    a + (b - a) * t
}
