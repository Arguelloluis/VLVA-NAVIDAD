// Music player setup
        const songs = [
            "Mariah Carey - All I Want for Christmas Is You (Make My Wish Come True Edition).mp4",
            "Michael Bublé - It's Beginning To Look A Lot Like Christmas.mp4",
            "Michael Bublé - Santa Claus Is Coming To Town [Official HD].mp4",
            "Michael Bublé - Holly Jolly Christmas [Official HD].mp4",
            "Michael Bublé - Christmas (Baby Please Come Home) [Official HD].mp4",
            "Feliz Navidad (ft. Thalia) [Official HD Audio].mp4"
        ];

        let currentAudio = null;
        let currentSong = -1;

        document.querySelectorAll('.song-item').forEach(item => {
            item.addEventListener('click', () => {
                const songIndex = parseInt(item.dataset.song);
                playSong(songIndex);
            });
        });

        document.getElementById('playPauseBtn').addEventListener('click', () => {
            if (currentAudio) {
                if (currentAudio.paused) {
                    currentAudio.play();
                    document.getElementById('playPauseBtn').textContent = '⏸️';
                } else {
                    currentAudio.pause();
                    document.getElementById('playPauseBtn').textContent = '▶️';
                }
            }
        });

        document.getElementById('stopBtn').addEventListener('click', () => {
            if (currentAudio) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
                document.getElementById('playPauseBtn').textContent = '▶️';
            }
        });

        document.getElementById('volumeSlider').addEventListener('input', (e) => {
            if (currentAudio) {
                currentAudio.volume = e.target.value / 100;
            }
        });

        function playSong(index) {
            if (currentAudio) {
                currentAudio.pause();
            }

            document.querySelectorAll('.song-item').forEach(item => {
                item.classList.remove('playing');
            });

            document.querySelector(`[data-song="${index}"]`).classList.add('playing');
            
            currentAudio = new Audio(songs[index]);
            currentAudio.volume = document.getElementById('volumeSlider').value / 100;
            currentAudio.play();
            document.getElementById('playPauseBtn').textContent = '⏸️';
            currentSong = index;

            currentAudio.addEventListener('ended', () => {
                const nextSong = (currentSong + 1) % songs.length;
                playSong(nextSong);
            });
        }

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0a1628);
        scene.fog = new THREE.Fog(0x0a1628, 10, 100);
        
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ 
            canvas: document.getElementById('canvas'),
            antialias: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Heavy snowfall
        const snowflakes = [];
        const snowGeometry = new THREE.SphereGeometry(0.15, 6, 6);
        for (let i = 0; i < 2000; i++) {
            const snowMaterial = new THREE.MeshStandardMaterial({ 
                color: 0xffffff,
                emissive: 0xffffff,
                emissiveIntensity: 0.3,
                transparent: true,
                opacity: 0.9
            });
            const snow = new THREE.Mesh(snowGeometry, snowMaterial);
            snow.position.set(
                (Math.random() - 0.5) * 150,
                Math.random() * 80,
                (Math.random() - 0.5) * 150
            );
            snow.userData = {
                velocity: Math.random() * 0.05 + 0.02,
                drift: Math.random() * 0.03,
                spin: Math.random() * 0.05
            };
            snowflakes.push(snow);
            scene.add(snow);
        }

        // Christmas tree with controllable lights
        const treeLights = [];
        const garlandLights = [];
        let lightsMode = 0; // 0: normal, 1: wave, 2: chase, 3: flash

        const createDetailedTree = () => {
            const tree = new THREE.Group();
            
            // Trunk
            const trunkGeometry = new THREE.CylinderGeometry(0.8, 1, 4, 12);
            const trunkMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x4a2511,
                roughness: 0.9,
                metalness: 0.1
            });
            const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
            trunk.position.y = 2;
            trunk.castShadow = true;
            trunk.receiveShadow = true;
            tree.add(trunk);

            // Tree layers
            const layers = 7;
            for (let i = 0; i < layers; i++) {
                const radius = 4.5 - i * 0.6;
                const height = 3;
                const coneGeometry = new THREE.ConeGeometry(radius, height, 12);
                const coneMaterial = new THREE.MeshStandardMaterial({ 
                    color: 0x0d5c1f,
                    roughness: 0.7,
                    metalness: 0.3,
                    emissive: 0x0d5c1f,
                    emissiveIntensity: 0.1
                });
                const cone = new THREE.Mesh(coneGeometry, coneMaterial);
                cone.position.y = 4.5 + i * 2.2;
                cone.castShadow = true;
                cone.receiveShadow = true;
                tree.add(cone);
            }

            // Star on top
            const starGeometry = new THREE.SphereGeometry(0.6, 16, 16);
            const starMaterial = new THREE.MeshStandardMaterial({ 
                color: 0xffff00,
                emissive: 0xffaa00,
                emissiveIntensity: 3,
                metalness: 0.8,
                roughness: 0.2
            });
            const star = new THREE.Mesh(starGeometry, starMaterial);
            star.position.y = 20;
            tree.add(star);

            const starLight = new THREE.PointLight(0xffff00, 2, 20);
            starLight.position.copy(star.position);
            tree.add(starLight);

            // Ornaments
            const ornamentColors = [0xff0066, 0x00ffff, 0xffff00, 0xff00ff, 0x00ff00, 0xff8800];
            for (let i = 0; i < 80; i++) {
                const size = Math.random() * 0.2 + 0.15;
                const ornamentGeometry = new THREE.SphereGeometry(size, 12, 12);
                const color = ornamentColors[Math.floor(Math.random() * ornamentColors.length)];
                const ornamentMaterial = new THREE.MeshStandardMaterial({
                    color: color,
                    emissive: color,
                    emissiveIntensity: 0.8,
                    metalness: 0.9,
                    roughness: 0.1
                });
                const ornament = new THREE.Mesh(ornamentGeometry, ornamentMaterial);
                
                const layer = Math.floor(Math.random() * 7);
                const angle = Math.random() * Math.PI * 2;
                const radius = (4.5 - layer * 0.6) * 0.75;
                
                ornament.position.x = Math.cos(angle) * radius;
                ornament.position.y = 5 + layer * 2.2;
                ornament.position.z = Math.sin(angle) * radius;
                
                if (Math.random() > 0.7) {
                    const ornamentLight = new THREE.PointLight(color, 0.5, 5);
                    ornamentLight.position.copy(ornament.position);
                    tree.add(ornamentLight);
                    treeLights.push({ light: ornamentLight, originalIntensity: 0.5, color: color });
                }
                
                tree.add(ornament);
            }

            // Garland lights (controllable)
            for (let i = 0; i < 120; i++) {
                const lightGeometry = new THREE.SphereGeometry(0.1, 8, 8);
                const lightColor = i % 2 === 0 ? 0xff0066 : 0x00ffff;
                const lightMaterial = new THREE.MeshStandardMaterial({
                    color: lightColor,
                    emissive: lightColor,
                    emissiveIntensity: 2
                });
                const light = new THREE.Mesh(lightGeometry, lightMaterial);
                
                const layer = (i / 120) * 7;
                const angle = (i / 120) * Math.PI * 10;
                const radius = (4.5 - layer * 0.6) * 0.9;
                
                light.position.x = Math.cos(angle) * radius;
                light.position.y = 5 + layer * 2.2;
                light.position.z = Math.sin(angle) * radius;
                
                tree.add(light);
                garlandLights.push({ mesh: light, material: lightMaterial, index: i, color: lightColor });
            }

            return tree;
        };

        const tree = createDetailedTree();
        scene.add(tree);

        // Lights button functionality
        document.getElementById('lightsBtn').addEventListener('click', () => {
            lightsMode = (lightsMode + 1) % 4;
            const modes = ['NORMAL', 'OLAS', 'PERSECUCIÓN', 'FLASH'];
            document.getElementById('lightsBtn').textContent = `✨ MODO: ${modes[lightsMode]} ✨`;
        });

        // Enhanced lighting for north pole
        const ambientLight = new THREE.AmbientLight(0x4a6b8f, 0.6);
        scene.add(ambientLight);

        const mainLight = new THREE.DirectionalLight(0xaaccff, 1.2);
        mainLight.position.set(10, 30, 10);
        mainLight.castShadow = true;
        mainLight.shadow.mapSize.width = 2048;
        mainLight.shadow.mapSize.height = 2048;
        scene.add(mainLight);

        // Colored lights
        const lights = [];
        const lightColors = [0xff0066, 0x00ffff, 0xffff00, 0xff00ff];
        for (let i = 0; i < 4; i++) {
            const light = new THREE.PointLight(lightColors[i], 2, 50);
            lights.push({
                light: light,
                angle: (Math.PI * 2 * i) / 4,
                radius: 25
            });
            scene.add(light);
        }

        // Snowy ground
        const groundGeometry = new THREE.CircleGeometry(60, 64);
        const groundMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xe8f4ff,
            roughness: 0.9,
            metalness: 0.1
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        scene.add(ground);

        // Snow mounds
        for (let i = 0; i < 30; i++) {
            const moundGeometry = new THREE.SphereGeometry(Math.random() * 2 + 1, 8, 8);
            const moundMaterial = new THREE.MeshStandardMaterial({ 
                color: 0xffffff,
                roughness: 0.9
            });
            const mound = new THREE.Mesh(moundGeometry, moundMaterial);
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 50 + 15;
            mound.position.x = Math.cos(angle) * distance;
            mound.position.z = Math.sin(angle) * distance;
            mound.position.y = -0.5;
            mound.scale.y = 0.5;
            scene.add(mound);
        }

        // Camera controls
        let cameraDistance = 35;
        let cameraAngle = 0;
        let cameraHeight = 15;
        let isDragging = false;
        let previousMouseX = 0;
        let previousMouseY = 0;

        camera.position.set(0, cameraHeight, cameraDistance);
        camera.lookAt(0, 10, 0);

        // Mouse controls
        const canvas = document.getElementById('canvas');
        
        canvas.addEventListener('mousedown', (e) => {
            isDragging = true;
            previousMouseX = e.clientX;
            previousMouseY = e.clientY;
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const deltaX = e.clientX - previousMouseX;
                const deltaY = e.clientY - previousMouseY;
                
                cameraAngle += deltaX * 0.005;
                cameraHeight -= deltaY * 0.05;
                cameraHeight = Math.max(5, Math.min(30, cameraHeight));
                
                previousMouseX = e.clientX;
                previousMouseY = e.clientY;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            cameraDistance += e.deltaY * 0.05;
            cameraDistance = Math.max(10, Math.min(60, cameraDistance));
        }, { passive: false });

        // Touch controls
        let touchStartX = 0;
        let touchStartY = 0;
        let touchStartDistance = 0;

        canvas.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                isDragging = true;
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
            } else if (e.touches.length === 2) {
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                touchStartDistance = Math.sqrt(dx * dx + dy * dy);
            }
        });

        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (e.touches.length === 1 && isDragging) {
                const deltaX = e.touches[0].clientX - touchStartX;
                const deltaY = e.touches[0].clientY - touchStartY;
                
                cameraAngle += deltaX * 0.005;
                cameraHeight -= deltaY * 0.05;
                cameraHeight = Math.max(5, Math.min(30, cameraHeight));
                
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
            } else if (e.touches.length === 2) {
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                cameraDistance -= (distance - touchStartDistance) * 0.1;
                cameraDistance = Math.max(10, Math.min(60, cameraDistance));
                
                touchStartDistance = distance;
            }
        }, { passive: false });

        canvas.addEventListener('touchend', () => {
            isDragging = false;
        });

        setTimeout(() => {
            document.getElementById('loading').classList.add('hidden');
        }, 2000);

        // Animation loop
        let time = 0;
        function animate() {
            requestAnimationFrame(animate);
            time += 0.01;

            tree.rotation.y += 0.003;

            // Animate snowflakes
            snowflakes.forEach(snow => {
                snow.position.y -= snow.userData.velocity;
                snow.position.x += Math.sin(time + snow.position.y) * snow.userData.drift;
                snow.position.z += Math.cos(time + snow.position.y) * snow.userData.drift;
                snow.rotation.y += snow.userData.spin;
                snow.rotation.x += snow.userData.spin * 0.5;
                
                if (snow.position.y < 0) {
                    snow.position.y = 80;
                    snow.position.x = (Math.random() - 0.5) * 150;
                    snow.position.z = (Math.random() - 0.5) * 150;
                }
            });

            // Lights animation modes
            if (lightsMode === 1) { // Wave
                garlandLights.forEach((lightObj, i) => {
                    const intensity = Math.sin(time * 3 + i * 0.2) * 1.5 + 2;
                    lightObj.material.emissiveIntensity = intensity;
                });
                treeLights.forEach((lightObj, i) => {
                    const intensity = Math.sin(time * 3 + i * 0.3) * 0.3 + 0.5;
                    lightObj.light.intensity = intensity;
                });
            } else if (lightsMode === 2) { // Chase
                const phase = Math.floor(time * 8) % garlandLights.length;
                garlandLights.forEach((lightObj, i) => {
                    const distance = Math.abs(i - phase);
                    const intensity = distance < 5 ? (5 - distance) * 0.8 : 0.3;
                    lightObj.material.emissiveIntensity = intensity;
                });
                treeLights.forEach((lightObj, i) => {
                    const treePhase = Math.floor(time * 5) % treeLights.length;
                    lightObj.light.intensity = (i === treePhase) ? 2 : 0.2;
                });
            } else if (lightsMode === 3) { // Flash
                const flashOn = Math.floor(time * 4) % 2 === 0;
                garlandLights.forEach((lightObj) => {
                    lightObj.material.emissiveIntensity = flashOn ? 4 : 0.2;
                });
                treeLights.forEach((lightObj) => {
                    lightObj.light.intensity = flashOn ? 1.5 : 0.1;
                });
            } else { // Normal
                garlandLights.forEach((lightObj) => {
                    lightObj.material.emissiveIntensity = 2;
                });
                treeLights.forEach((lightObj) => {
                    lightObj.light.intensity = lightObj.originalIntensity;
                });
            }

            // Orbit lights
            lights.forEach((lightObj, index) => {
                lightObj.angle += 0.005;
                lightObj.light.position.x = Math.cos(lightObj.angle) * lightObj.radius;
                lightObj.light.position.z = Math.sin(lightObj.angle) * lightObj.radius;
                lightObj.light.position.y = 15 + Math.sin(time + index) * 5;
            });

            // Update camera
            camera.position.x = Math.sin(cameraAngle) * cameraDistance;
            camera.position.z = Math.cos(cameraAngle) * cameraDistance;
            camera.position.y = cameraHeight;
            camera.lookAt(0, 10, 0);

            renderer.render(scene, camera);
        }

        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });