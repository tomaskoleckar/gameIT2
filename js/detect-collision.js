/* Detekce kolize mezi dvěma kruhy */
function detectCollisionCircleCircle(circle1, circle2) {
    let sidea = Math.abs(circle1.x - circle2.x);
    let sideb = Math.abs(circle1.y - circle2.y);
    let distance = Math.sqrt(sidea ** 2 + sideb ** 2);
    return (distance < circle1.radius + circle2.radius);
}

/* Detekce kolize mezi dvěma obdélníky */
function detectCollisionRectRect(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x && rect1.y + rect1.height > rect2.y && rect1.y < rect2.y + rect2.height;
}

/* Detekce kolize mezi kruhem a obdélníkem */
function detectCollisionCircleRect(circle, rect) {
    let distX = Math.abs(circle.x - rect.x-rect.width/2);
    let distY = Math.abs(circle.y - rect.y-rect.height/2);

    if (distX > (rect.width/2 + circle.radius)) { return false; }
    if (distY > (rect.height/2 + circle.radius)) { return false; }

    if (distX <= (rect.width/2)) { return true; } 
    if (distY <= (rect.height/2)) { return true; }

    let dx=distX-rect.width/2;
    let dy=distY-rect.height/2;
    return (dx**2 + dy**2 <= circle.radius ** 2); 
}


/* Detekce kolize mezi kruhem a čtvercem */
function detectCollisionCircleSquare(circle, rect) {
    let distX = Math.abs(circle.x - rect.x-rect.size/2);
    let distY = Math.abs(circle.y - rect.y-rect.size/2);

    if (distX > (rect.size/2 + circle.radius)) { return false; }
    if (distY > (rect.size/2 + circle.radius)) { return false; }

    if (distX <= (rect.size/2)) { return true; } 
    if (distY <= (rect.size/2)) { return true; }

    let dx=distX-rect.size/2;
    let dy=distY-rect.size/2;
    return (dx**2 + dy**2 <= circle.radius ** 2); 
}