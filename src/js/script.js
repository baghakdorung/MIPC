/**
 * @fileoverview Immersive 3D Background System
 * @description Manages the WebGL rendering pipeline, scene graph construction, 
 * and interactive event handling using Three.js.
 * @version 2.0.0
 */

/* ==========================================================================
   CLASS: ADMISSION SCENE CONTROLLER
   ========================================================================== */

/**
 * Handles the lifecycle of the 3D environment including initialization,
 * asset generation, and the main render loop.
 */
class AdmissionScene {
    
    /**
     * @param {string} containerId - The DOM ID of the wrapper element.
     */
    constructor(containerId) {
        // 1. DOM Reference
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`[AdmissionScene] Container '#${containerId}' not found.`);
            return;
        }

        // 2. Core Components (Rendering Pipeline)
        this.scene = null;
        this.camera = null;
        this.renderer = null;

        // 3. Scene Graph Containers
        this.objects = {}; 

        // 4. State Management
        this.clock = new THREE.Clock();
        this.mouse = { x: 0, y: 0 };    // Raw mouse coordinates
        this.target = { x: 0, y: 0 };   // Interpolated target for smooth camera

        // 5. Lifecycle Initialization
        this.init();
        this.createObjects();
        this.addListeners();
        this.animate();
    }


    /* -------------------------------------------------------------------------- */
    /* 1. INITIALIZATION PIPELINE                                               */
    /* -------------------------------------------------------------------------- */

    init() {
        // A. Scene Construction
        this.scene = new THREE.Scene();
        // Fog effect for depth perception (Color: Dark Blue, Density: 0.0015)
        this.scene.fog = new THREE.FogExp2(0x050510, 0.0015);

        // B. Camera Configuration
        this.camera = new THREE.PerspectiveCamera(
            75, // Field of View
            window.innerWidth / window.innerHeight, // Aspect Ratio
            0.1, // Near Plane
            1000 // Far Plane
        );
        this.camera.position.z = 30;

        // C. Renderer Setup
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, // Smoothens jagged edges
            alpha: true      // Allows transparent background
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        
        // High-DPI Optimization: 
        // Clamps pixel ratio to 2.0 to balance visual fidelity vs GPU load.
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        this.container.appendChild(this.renderer.domElement);

        // D. Lighting System
        const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
        const pointLight = new THREE.PointLight(0x3b82f6, 2, 100); // Blue highlight
        pointLight.position.set(10, 10, 10);
        
        this.scene.add(ambientLight);
        this.scene.add(pointLight);
    }


    /* -------------------------------------------------------------------------- */
    /* 2. SCENE GRAPH GENERATION                                                */
    /* -------------------------------------------------------------------------- */

    createObjects() {
        // Group A: The Core (Icosahedron Structure)
        // -----------------------------------------
        const coreGeo = new THREE.IcosahedronGeometry(4, 1);
        const coreMat = new THREE.MeshBasicMaterial({ 
            color: 0x60a5fa, 
            wireframe: true, 
            transparent: true, 
            opacity: 0.3 
        });
        this.objects.core = new THREE.Mesh(coreGeo, coreMat);
        this.scene.add(this.objects.core);

        // Inner solid core
        const innerGeo = new THREE.IcosahedronGeometry(2, 0);
        const innerMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        this.objects.innerCore = new THREE.Mesh(innerGeo, innerMat);
        this.scene.add(this.objects.innerCore);

        // Group B: Particle System (Starfield)
        // ------------------------------------
        const partGeo = new THREE.BufferGeometry();
        const count = 3000;
        const posArray = new Float32Array(count * 3);
        
        // Random distribution in 3D space
        for(let i = 0; i < count * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 100;
        }
        
        partGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        
        const partMat = new THREE.PointsMaterial({
            size: 0.15, 
            color: 0xbae6fd, 
            transparent: true, 
            opacity: 0.8, 
            blending: THREE.AdditiveBlending // Glow effect
        });
        
        this.objects.particles = new THREE.Points(partGeo, partMat);
        this.scene.add(this.objects.particles);

        // Group C: Orbital Rings
        // ----------------------
        const ringGeo = new THREE.TorusGeometry(12, 0.05, 16, 100);
        const ringMat = new THREE.MeshBasicMaterial({ 
            color: 0x334155, 
            transparent: true, 
            opacity: 0.3 
        });
        
        this.objects.rings = [];
        
        // Create 3 rings with different initial rotations
        const r1 = new THREE.Mesh(ringGeo, ringMat); r1.rotation.x = Math.PI / 2;
        const r2 = new THREE.Mesh(ringGeo, ringMat); r2.rotation.x = Math.PI / 3; r2.rotation.y = Math.PI / 6;
        const r3 = new THREE.Mesh(ringGeo, ringMat); r3.rotation.x = -Math.PI / 3;
        
        this.objects.rings.push(r1, r2, r3);
        this.scene.add(r1, r2, r3);
    }


    /* -------------------------------------------------------------------------- */
    /* 3. EVENT DELEGATION                                                      */
    /* -------------------------------------------------------------------------- */

    addListeners() {
        // Handle Viewport Resizing
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Capture Mouse Input for Parallax
        document.addEventListener('mousemove', (e) => {
            const windowHalfX = window.innerWidth / 2;
            const windowHalfY = window.innerHeight / 2;
            
            // Normalize coordinates relative to center
            this.mouse.x = (e.clientX - windowHalfX);
            this.mouse.y = (e.clientY - windowHalfY);
        });
    }


    /* -------------------------------------------------------------------------- */
    /* 4. RENDER LOOP (ANIMATION)                                               */
    /* -------------------------------------------------------------------------- */

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        const elapsedTime = this.clock.getElapsedTime();

        // A. Input Interpolation (Lerp)
        // Smoothly transitions current camera angle to target angle
        // Coefficient 0.001 determines the "lag" or "weight" of the movement.
        this.target.x = this.mouse.x * 0.001;
        this.target.y = this.mouse.y * 0.001;

        // B. Scene Graph Transformations
        
        // Rotate Core
        if(this.objects.core) {
            this.objects.core.rotation.y += 0.005;
            this.objects.core.rotation.x += 0.002;
        }
        
        // Pulse Inner Core (Sine Wave Scale)
        if(this.objects.innerCore) {
            const scale = 1 + Math.sin(elapsedTime * 2) * 0.1;
            this.objects.innerCore.scale.set(scale, scale, scale);
        }

        // Rotate Rings (Gyroscopic effect)
        if(this.objects.rings) {
            this.objects.rings[0].rotation.z += 0.002;
            this.objects.rings[1].rotation.z -= 0.003;
            this.objects.rings[2].rotation.z += 0.001;
        }

        // Parallax Effect for Particles
        if(this.objects.particles) {
            this.objects.particles.rotation.y = -elapsedTime * 0.05;
            // Subtle tilt based on mouse Y
            this.objects.particles.rotation.x = this.mouse.y * 0.00005;
        }

        // C. Camera Smooth Follow Logic
        // Formula: current += (target - current) * friction
        this.camera.rotation.y += 0.05 * (this.target.x - this.camera.rotation.y);
        this.camera.rotation.x += 0.05 * (this.target.y - this.camera.rotation.x);

        // D. Final Render
        this.renderer.render(this.scene, this.camera);
    }
}


/* ==========================================================================
   UI INTERACTION LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize 3D Scene Background
    new AdmissionScene('canvas-container');

    // 2. UI Component References
    const uiElements = {
        applyBtn: document.getElementById('apply-btn'),
        closeBtn: document.getElementById('close-btn'),
        modal: document.getElementById('custom-alert')
    };

    // 3. Modal State Handlers
    const toggleModal = (isActive) => {
        if (!uiElements.modal) return;
        
        if (isActive) uiElements.modal.classList.add('active');
        else uiElements.modal.classList.remove('active');
    };

    // 4. Event Binding
    if (uiElements.applyBtn) {
        uiElements.applyBtn.addEventListener('click', () => toggleModal(true));
    }
    
    if (uiElements.closeBtn) {
        uiElements.closeBtn.addEventListener('click', () => toggleModal(false));
    }
    
    // Close on backdrop click (Overlay interaction)
    if (uiElements.modal) {
        uiElements.modal.addEventListener('click', (e) => {
            if (e.target === uiElements.modal) toggleModal(false);
        });
    }
});