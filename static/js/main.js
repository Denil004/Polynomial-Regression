/* ═══════════════════════════════════════════
   Salary Predictor — Frontend Logic (Polynomial Theme)
   ═══════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {

    /* ── Element refs ─── */
    const form        = document.getElementById("predict-form");
    const yearsInput  = document.getElementById("years-input");
    const yearsSlider = document.getElementById("years-slider");
    const predictBtn  = document.getElementById("predict-btn");
    const resultPanel = document.getElementById("result-panel");
    const resultValue = document.getElementById("result-value");
    const resultMeta  = document.getElementById("result-meta");

    /* ── Sync slider ↔ input ─── */
    yearsSlider.addEventListener("input", () => {
        yearsInput.value = yearsSlider.value;
    });
    yearsInput.addEventListener("input", () => {
        const v = parseFloat(yearsInput.value);
        if (!isNaN(v) && v >= 0 && v <= 20) {
            yearsSlider.value = v;
        }
    });

    /* ── Form submit → API call ─── */
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const years = parseFloat(yearsInput.value);
        if (isNaN(years) || years < 0) {
            shakeCard();
            return;
        }

        // Loading state
        predictBtn.classList.add("loading");
        predictBtn.disabled = true;

        try {
            const res = await fetch("/predict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ years_experience: years }),
            });

            if (!res.ok) throw new Error("Server error");

            const data = await res.json();
            const salary = data.predicted_salary;

            // Format salary
            resultValue.textContent = "$" + salary.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
            resultMeta.textContent = `Based on ${years} year${years !== 1 ? "s" : ""} of experience`;

            // Show result with animation
            resultPanel.classList.add("visible");

            // Animate the number (count-up effect)
            animateValue(resultValue, 0, salary, 700);

        } catch (err) {
            resultValue.textContent = "Error";
            resultMeta.textContent = "Could not reach the prediction API.";
            resultPanel.classList.add("visible");
        } finally {
            predictBtn.classList.remove("loading");
            predictBtn.disabled = false;
        }
    });

    /* ── Count-up animation ─── */
    function animateValue(el, start, end, duration) {
        let startTime = null;
        function update(now) {
            if (!startTime) startTime = now;
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic polynomial curve for animation
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = start + (end - start) * eased;
            el.textContent = "$" + current.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

    /* ── Shake card on invalid input ─── */
    function shakeCard() {
        const card = document.getElementById("predict-card");
        card.style.animation = "none";
        void card.offsetWidth; // reflow
        card.style.animation = "shake 0.4s ease";
        setTimeout(() => card.style.animation = "", 400);
    }

    /* ═══════════════════════
       Particle Background (Polynomial curves emphasis)
       ═══════════════════════ */
    const canvas = document.getElementById("particles");
    const ctx    = canvas.getContext("2d");
    let particles = [];
    const COUNT = 70; // Slightly more particles

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resize);
    resize();

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x  = Math.random() * canvas.width;
            this.y  = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.r  = Math.random() * 2.5 + 0.5;
            this.alpha = Math.random() * 0.5 + 0.1;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height)  this.vy *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 210, 255, ${this.alpha})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < COUNT; i++) particles.push(new Particle());

    // Draw slightly curved lines to imply polynomial relationships
    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 130) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    // Add slight curve control point
                    const cx = (particles[i].x + particles[j].x) / 2 + (dy * 0.2);
                    const cy = (particles[i].y + particles[j].y) / 2 - (dx * 0.2);
                    ctx.quadraticCurveTo(cx, cy, particles[j].x, particles[j].y);
                    
                    ctx.strokeStyle = `rgba(0, 210, 255, ${0.08 * (1 - dist / 130)})`;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        drawLines();
        requestAnimationFrame(animate);
    }
    animate();
});

/* shake keyframe (injected via JS since CSS file is separate) */
const style = document.createElement("style");
style.textContent = `@keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%  { transform: translateX(-8px); }
    40%  { transform: translateX(8px); }
    60%  { transform: translateX(-4px); }
    80%  { transform: translateX(4px); }
}`;
document.head.appendChild(style);
