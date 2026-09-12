document.addEventListener("DOMContentLoaded", () => {
  /* ============================================================
     Three.js 3D Particle Network
     ============================================================ */
  const canvas = document.getElementById("bg-canvas");
  
  if (canvas && typeof THREE !== 'undefined') {
    const scene = new THREE.Scene();
    // Use a very dark background matching CSS
    scene.background = new THREE.Color(0x030305);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 200;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // performance optimization

    // Create particles
    const particleCount = 400; // Keep it reasonable for performance
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 600;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 600;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 600;

      velocities.push({
        x: (Math.random() - 0.5) * 0.2,
        y: (Math.random() - 0.5) * 0.2,
        z: (Math.random() - 0.5) * 0.2
      });
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Material for particles
    const pMaterial = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 1.5,
      transparent: true,
      opacity: 0.8,
    });

    const particleSystem = new THREE.Points(particles, pMaterial);
    scene.add(particleSystem);

    // Create Lines connecting nearby particles
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x818cf8,
      transparent: true,
      opacity: 0.15
    });
    
    // We'll update the lines geometry every frame
    let linesMesh;

    // Mouse interaction for parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
      mouseX = (event.clientX - windowHalfX);
      mouseY = (event.clientY - windowHalfY);
    });

    // Animation Loop
    function animate() {
      requestAnimationFrame(animate);

      // Move particles
      const positions = particleSystem.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] += velocities[i].x;
        positions[i * 3 + 1] += velocities[i].y;
        positions[i * 3 + 2] += velocities[i].z;

        // Bounce off bounds
        if (Math.abs(positions[i * 3]) > 300) velocities[i].x *= -1;
        if (Math.abs(positions[i * 3 + 1]) > 300) velocities[i].y *= -1;
        if (Math.abs(positions[i * 3 + 2]) > 300) velocities[i].z *= -1;
      }
      particleSystem.geometry.attributes.position.needsUpdate = true;

      // Draw lines between close particles
      // To keep it fast, we don't connect ALL, just a subset or use a fixed distance
      // Optimization: Only update lines every few frames, or just rotate the whole system.
      // For maximum smoothness, we'll just rotate the points and a static line network, 
      // or we can draw lines dynamically if device is fast. We will just rotate the system.
      
      particleSystem.rotation.y += 0.001;
      particleSystem.rotation.x += 0.0005;

      // Parallax effect
      targetX = mouseX * 0.05;
      targetY = mouseY * 0.05;
      
      camera.position.x += (targetX - camera.position.x) * 0.02;
      camera.position.y += (-targetY - camera.position.y) * 0.02;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    }
    
    animate();

    // Resize handler
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  /* ============================================================
     GSAP Scroll Animations
     ============================================================ */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Fade and slide up elements as they enter the viewport
    const revealElements = document.querySelectorAll('.gs-reveal');
    
    revealElements.forEach((el) => {
      // Remove hidden visibility that we set in CSS
      gsap.set(el, { autoAlpha: 0 });
      
      gsap.fromTo(el, 
        { y: 50, autoAlpha: 0 },
        {
          duration: 1,
          y: 0,
          autoAlpha: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%", // when the top of the element hits 85% of the viewport
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // Nav Background on scroll
    const nav = document.querySelector('.nav');
    if (nav) {
      ScrollTrigger.create({
        start: 'top -50',
        onUpdate: (self) => {
          if (self.direction === 1) {
            gsap.to(nav, { backgroundColor: 'rgba(3, 3, 5, 0.9)', backdropFilter: 'blur(10px)', duration: 0.3 });
          } else if (self.scroll() < 50) {
            gsap.to(nav, { backgroundColor: 'transparent', backdropFilter: 'none', duration: 0.3 });
          }
        }
      });
    }
  }

  /* ============================================================
     Contact Form Handler (Web3Forms)
     ============================================================ */
  const form = document.getElementById('contactForm');
  const result = document.getElementById('formResult');
  const formInputs = document.getElementById('formInputs');

  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const formData = new FormData(form);
      const object = Object.fromEntries(formData);
      const json = JSON.stringify(object);

      formInputs.style.display = "none";
      result.style.display = "block";
      result.innerHTML = "Sending...";
      result.className = "form-result text-success";

      fetch('https://formsubmit.co/ajax/harikarthikselvam@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: json
      })
      .then(async (response) => {
        let resJson = await response.json();
        if (response.status == 200) {
          result.innerHTML = "Thanks for reaching out to me, we will check your mail.";
          result.className = "form-result text-success";
        } else {
          console.log(response);
          result.innerHTML = resJson.message || "Something went wrong!";
          result.className = "form-result text-error";
        }
      })
      .catch(error => {
        console.log(error);
        result.innerHTML = "Something went wrong!";
        result.className = "form-result text-error";
      })
      .then(function() {
        form.reset();
        setTimeout(() => {
          result.style.display = "none";
          formInputs.style.display = "block";
        }, 10000);
      });
    });
  }

});
