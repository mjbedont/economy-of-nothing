// Resize canvas to match the container
function resizeCanvas() {
  const container = document.getElementById('mapContainer');
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;

  generatePlanets();
  draw();
}

// Redraw planets and ship within the bounds
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  planets.forEach((planet) => {
    ctx.beginPath();
    ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
    ctx.fillStyle = planet.color;
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
    ctx.font = '12px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(planet.name, planet.x, planet.y - planet.radius - 5);
  });

  ctx.fillStyle = ship.color;
  ctx.fillRect(ship.x, ship.y, ship.width, ship.height);
}
