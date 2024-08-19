// 3D Wardrobe functionality

document.addEventListener('DOMContentLoaded', () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('wardrobe-container').appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0x404040, 8);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff, 0);
    spotLight.position.set(0, 0, 10);
    spotLight.angle = Math.PI / 5;
    spotLight.penumbra = 0.5;
    spotLight.distance = 10;
    scene.add(spotLight);

    const spotLightTarget = new THREE.Object3D();
    scene.add(spotLightTarget);
    spotLight.target = spotLightTarget;

    const loader = new THREE.GLTFLoader();
    const models = [];

    const modelPaths = [
        '/3DM/GLN_DENIM_JACKET.glb',
        '/3DM/GLN_LEATHER_JACKET.glb',
        '/3DM/GLN_LEATHER_JACKET_2.glb',
        '/3DM/GLN_LEATHER_VEST.glb',
        '/3DM/GLN_LEATHER_JACKET_3.glb',
        '/3DM/GLN_LEATHER_JACKET_4.glb'
    ];

    const modelPositions = [
        [-8, -3.5, 0],
        [-5, -3.8, 0],
        [-2, -3.5, 0],
        [1, -3, 0],
        [4, -3.5, 0],
        [7, -3.5, 0]
    ];

    const defaultScale = 4;

    const productInfo = {
        '/3DM/GLN_DENIM_JACKET.glb': {
            title: "K2G LEATHER JACKET",
            price: "£2,000.00",
            description: "This is a 1 of 1 piece which was hand-screenprinted by GALANACCI THE CREATOR. 'K2G,' standing for 'Keys 2 Greatness,' is the brand's emblem and serves as a&nbsp;symbol for greatness. This emblem originates from the original 'Greatness' graphic.",
            images: [
                "/IMAGES/GALANACCI_COLLECTION/PRODUCT_2/1.png",
                "/IMAGES/GALANACCI_COLLECTION/PRODUCT_2/2.png",
                "/IMAGES/GALANACCI_COLLECTION/PRODUCT_2/3.png"
            ]
        },
        '/3DM/GLN_LEATHER_JACKET.glb': {
            title: "K2G CROPPED LEATHER JACKET",
            price: "£2,500.00",
            description: "This is a 1 of 1 piece which was hand-screenprinted by GALANACCI THE CREATOR. The 'Core' refers to the combination of the 'Pioneers of Greatness' slogan (front) and the 'Keys 2 Greatness' emblem (back). This is a flagship design for GALANACCI® and it symbolizes the pursuit of greatness.",
            images: [
                "/IMAGES/GALANACCI_COLLECTION/PRODUCT_3/1.png",
                "/IMAGES/GALANACCI_COLLECTION/PRODUCT_3/2.png",
                "/IMAGES/GALANACCI_COLLECTION/PRODUCT_3/3.png"
            ]
        },
        '/3DM/GLN_LEATHER_JACKET_2.glb': {
            title: "Product Title 3",
            price: "£3,200.00",
            description: "Product description will be inserted here.",
            images: [
                "/images/leather_jacket_2_1.jpg",
                "/images/leather_jacket_2_2.jpg",
                "/images/leather_jacket_2_3.jpg"
            ]
        },
        '/3DM/GLN_LEATHER_VEST.glb': {
            title: "Product Title 4",
            price: "£1,500.00",
            description: "Product description will be inserted here.",
            images: [
                "/images/leather_jacket_2_1.jpg",
                "/images/leather_jacket_2_2.jpg",
                "/images/leather_jacket_2_3.jpg"
            ]
        },
        '/3DM/GLN_LEATHER_JACKET_3.glb': {
            title: "POG DENIM JACKET",
            price: "£1,500.00",
            description: "This is a 1 of 1 piece which was hand-embroidered by GALANACCI THE CREATOR. 'POG,' standing for 'Pioneers of Greatness,' is the brand's slogan and serves as an invitation for you to become a pioneer of greatness. This concept originates from the 'Greatness' poem.",
            images: [
                "/IMAGES/GALANACCI_COLLECTION/PRODUCT_1/1.png",
                "/IMAGES/GALANACCI_COLLECTION/PRODUCT_1/2.png",
                "/IMAGES/GALANACCI_COLLECTION/PRODUCT_1/3.png"
            ]
        },
        '/3DM/GLN_LEATHER_JACKET_4.glb': {
            title: "Product Title 6",
            price: "£1,500.00",
            description: "Product description will be inserted here.",
            images: [
                "/images/leather_jacket_4_1.jpg",
                "/images/leather_jacket_4_2.jpg",
                "/images/leather_jacket_4_3.jpg"
            ]
        }
    };

    modelPaths.forEach((path, index) => {
        console.log('Loading model:', path);
        loader.load(path, (gltf) => {
            console.log('Model loaded:', path);
            const model = gltf.scene;
            model.position.set(...modelPositions[index]);
            model.scale.set(defaultScale, defaultScale, defaultScale);
            model.userData.isSelected = false;
            model.userData.defaultScale = defaultScale;
            scene.add(model);
            models.push(model);
        }, undefined, (error) => {
            console.error(error);
        });
    });

    camera.position.set(0, -2, 7);

    const cameraSlider = document.getElementById('camera-slider');
    let initialCameraPosition = new THREE.Vector3(0, -2, 7);
    let mobileZoomFactor = 0.85;

    function updateCameraPosition() {
        if (selectedModel && selectedModel.userData.isSelected) return;
        
        const sliderValue = parseFloat(cameraSlider.value);
        camera.position.x = initialCameraPosition.x + sliderValue;
        camera.lookAt(new THREE.Vector3(sliderValue, -2, 0));
    }

    cameraSlider.addEventListener('input', updateCameraPosition);

    function adjustCameraAndModels() {
        const aspect = window.innerWidth / window.innerHeight;
        const isMobile = aspect < 1;
    
        if (isMobile) {
            camera.fov = 100;
            camera.position.z = 7 * mobileZoomFactor;
        } else {
            camera.fov = 75;
            camera.position.z = 7;
        }
    
        models.forEach(model => {
            const scale = model.userData.defaultScale * (isMobile ? mobileZoomFactor : 1);
            model.scale.set(scale, scale, scale);
        });
    
        camera.updateProjectionMatrix();
    }

    let selectedModel = null;
    let isDragging = false;
    let previousMousePosition = {
        x: 0,
        y: 0
    };
    let isTransitioning = false;

    let touchStartX, touchStartY;
    let rotationSpeed = 0.005;
    let rotationMomentum = 0;
    let lastTouchTime = 0;
    const maxRotationSpeed = 0.1;

    let currentZoom = 1;
    const maxZoom = 1.3;
    const minZoom = 1;
    const zoomSpeed = 0.005;
    let initialCameraDistance = 7;

    function updateModelRotation() {
        if (selectedModel && selectedModel.userData.isSelected) {
            rotationMomentum = Math.max(Math.min(rotationMomentum, maxRotationSpeed), -maxRotationSpeed);
            selectedModel.rotation.y += rotationMomentum;
            rotationMomentum *= 0.95;

            selectedModel.rotation.y = selectedModel.rotation.y % (2 * Math.PI);
            if (selectedModel.rotation.y < 0) {
                selectedModel.rotation.y += 2 * Math.PI;
            }

            if (Math.abs(rotationMomentum) > 0.0001) {
                requestAnimationFrame(updateModelRotation);
            }
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        models.forEach(model => {
            if (!model.userData.isSelected && model.userData.isRotating) {
                model.rotation.y += 0.005;
            }
        });
        if (selectedModel && selectedModel.userData.isSelected) {
            rotationMomentum = Math.max(Math.min(rotationMomentum, maxRotationSpeed), -maxRotationSpeed);
            selectedModel.rotation.y += rotationMomentum;
            rotationMomentum *= 0.95;

            selectedModel.rotation.y = selectedModel.rotation.y % (2 * Math.PI);
            if (selectedModel.rotation.y < 0) {
                selectedModel.rotation.y += 2 * Math.PI;
            }
        } else {
            updateCameraPosition();
        }
        TWEEN.update();
        renderer.render(scene, camera);
    }
    animate();

    function isMobileDevice() {
        return window.innerWidth <= 768;
    }

    function isPointInOverlay(x, y) {
        const overlay = document.getElementById('product-overlay');
        const rect = overlay.getBoundingClientRect();
        return (
            x >= rect.left &&
            x <= rect.right &&
            y >= rect.top &&
            y <= rect.bottom &&
            overlay.classList.contains('visible')
        );
    }

    function showOverlay(modelPath) {
        console.log('Showing overlay for:', modelPath);
        const info = productInfo[modelPath];
        if (info) {
          try {
            document.getElementById('product-title').textContent = info.title;
            document.getElementById('product-price').textContent = info.price;
            document.getElementById('product-description').textContent = info.description;
            
            // Populate images
            const imageContainer = document.querySelector('#image-overlay .image-container');
            const mobileImageContainer = document.querySelector('#product-overlay .product-images');
            if (imageContainer) imageContainer.innerHTML = '';
            if (mobileImageContainer) mobileImageContainer.innerHTML = '';
            
            info.images.forEach((src, index) => {
              const img = document.createElement('img');
              img.src = src;
              img.alt = info.title;
              img.addEventListener('click', (event) => {
                console.log('Image clicked');
                event.stopPropagation(); // Prevent event from bubbling up
                images = info.images.map(src => {
                    const img = new Image();
                    img.src = src;
                    return img;
                });
                showImage(index);
                showViewer();
              });
              if (imageContainer) imageContainer.appendChild(img.cloneNode(true));
              if (mobileImageContainer) mobileImageContainer.appendChild(img);
            });
      
            document.getElementById('product-overlay').classList.add('visible');
            document.getElementById('image-overlay').classList.add('visible');
            
            if (isMobileDevice()) {
              document.getElementById('product-overlay').style.height = '50%';
            }
          } catch (error) {
            console.error('Error showing overlay:', error);
          }
        } else {
          console.error('No product info found for:', modelPath);
        }

        if (isMobileDevice()) {
            document.getElementById('product-overlay').style.overflowY = 'auto';
            document.getElementById('product-overlay').style.WebkitOverflowScrolling = 'touch';
        }
    }

    function hideOverlay() {
        console.log('Hiding overlay');
        document.getElementById('product-overlay').classList.remove('visible');
        document.getElementById('image-overlay').classList.remove('visible');
        if (isMobileDevice()) {
          document.getElementById('product-overlay').style.height = '33.33%';
        }
    }

    function onClick(event) {
        if (event.target.tagName === 'SELECT') return;
        console.log('Click event triggered');
        event.preventDefault();
    
        if (isTransitioning) return;
    
        const clientX = event.clientX || (event.touches && event.touches[0].clientX);
        const clientY = event.clientY || (event.touches && event.touches[0].clientY);
    
        if (isPointInOverlay(clientX, clientY)) return;
    
        const mouse = new THREE.Vector2(
            (clientX / window.innerWidth) * 2 - 1,
            -(clientY / window.innerHeight) * 2 + 1
        );
    
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
    
        const intersects = raycaster.intersectObjects(models, true);
    
        if (intersects.length > 0) {
            const clickedModel = intersects[0].object.parent;
    
            if (selectedModel && selectedModel !== clickedModel) {
                selectedModel.userData.isSelected = false;
            }
    
            selectedModel = clickedModel;
            isTransitioning = true;
    
            const boundingBox = new THREE.Box3().setFromObject(clickedModel);
            const center = boundingBox.getCenter(new THREE.Vector3());
            const size = boundingBox.getSize(new THREE.Vector3());
            const distance = size.length() * 0.75;
            const isMobile = window.innerWidth <= 768;
            const zoomFactor = isMobile ? mobileZoomFactor : 1;
            
            new TWEEN.Tween(camera.position)
            .to({
                x: center.x,
                y: center.y,
                z: (center.z + distance) * zoomFactor
            }, 1000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onComplete(() => {
                isTransitioning = false;
                selectedModel.userData.isSelected = true;
                currentZoom = 1;
                initialCameraDistance = distance * zoomFactor;
                cameraSlider.value = "0"; // Reset slider when model is selected
            })
            .start();
    
            spotLight.position.set(center.x, center.y, center.z + distance);
            spotLightTarget.position.copy(center);
    
            new TWEEN.Tween(spotLight)
                .to({ intensity: 5 }, 1000)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .start();
    
            new TWEEN.Tween(ambientLight)
                .to({ intensity: 0 }, 1000)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .start();
    
            const modelPath = modelPaths[models.indexOf(clickedModel)];
            showOverlay(modelPath);
    
        } else if (selectedModel) {
            isTransitioning = true;
            
            // Store the current rotation of the selected model
            const currentRotation = selectedModel.rotation.y;

            const isMobile = window.innerWidth / window.innerHeight < 1;
            const targetZ = initialCameraPosition.z * (isMobile ? mobileZoomFactor : 1);
            
            new TWEEN.Tween(camera.position)
                .to({ 
                    x: initialCameraPosition.x, 
                    y: initialCameraPosition.y, 
                    z: initialCameraPosition.z
                }, 1500) // Increased duration for smoother transition
                .easing(TWEEN.Easing.Cubic.InOut) // Changed easing function
                .start();
        
            new TWEEN.Tween(camera.rotation)
                .to({ x: 0, y: 0, z: 0 }, 1500)
                .easing(TWEEN.Easing.Cubic.InOut)
                .start();
        
            new TWEEN.Tween(spotLight)
                .to({ intensity: 0 }, 1500)
                .easing(TWEEN.Easing.Cubic.InOut)
                .start();
        
            new TWEEN.Tween(ambientLight)
                .to({ intensity: 8 }, 1500)
                .easing(TWEEN.Easing.Cubic.InOut)
                .start();
        
            // Gradually resume rotation for all models
            models.forEach(model => {
                new TWEEN.Tween(model.rotation)
                    .to({ y: currentRotation }, 1500)
                    .easing(TWEEN.Easing.Cubic.InOut)
                    .onComplete(() => {
                        model.userData.isRotating = true;
                    })
                    .start();
            });
        
            new TWEEN.Tween({})
                .to({}, 1500)
                .easing(TWEEN.Easing.Cubic.InOut)
                .onComplete(() => {
                    isTransitioning = false;
                    selectedModel.userData.isSelected = false;
                    selectedModel = null;
                    currentZoom = 1;
                    adjustCameraAndModels();
                    updateCameraPosition();
                })
                .start();
        
            hideOverlay();
        }
    }

    function handleZoom(delta) {
        if (selectedModel && selectedModel.userData.isSelected) {
            currentZoom += delta;
            currentZoom = Math.max(minZoom, Math.min(maxZoom, currentZoom));
    
            const boundingBox = new THREE.Box3().setFromObject(selectedModel);
            const center = boundingBox.getCenter(new THREE.Vector3());
            
            const newCameraPosition = new THREE.Vector3(
                center.x,
                center.y,
                center.z + initialCameraDistance / currentZoom
            );
    
            camera.position.copy(newCameraPosition);
            camera.lookAt(center);
        }
    }

    window.addEventListener('mousedown', (event) => {
        if (isPointInOverlay(event.clientX, event.clientY)) return;
        if (selectedModel && selectedModel.userData.isSelected && !isTransitioning) {
            isDragging = true;
            previousMousePosition.x = event.clientX;
            previousMousePosition.y = event.clientY;
        }
    });

    window.addEventListener('touchstart', (event) => {
        if (isPointInOverlay(event.touches[0].clientX, event.touches[0].clientY)) return;
        if (selectedModel && selectedModel.userData.isSelected && !isTransitioning) {
            if (event.touches.length === 1) {
                isDragging = true;
                touchStartX = event.touches[0].clientX;
                touchStartY = event.touches[0].clientY;
                lastTouchTime = Date.now();
                rotationMomentum = 0;
            } else if (event.touches.length === 2) {
                initialPinchDistance = Math.hypot(
                    event.touches[0].clientX - event.touches[1].clientX,
                    event.touches[0].clientY - event.touches[1].clientY
                );
            }
        }
    }, { passive: false });

    window.addEventListener('mousemove', (event) => {
        if (isPointInOverlay(event.clientX, event.clientY)) {
            document.body.style.cursor = 'auto';
            return;
        }
        if (isDragging && selectedModel && selectedModel.userData.isSelected) {
            const deltaMove = {
                x: event.clientX - previousMousePosition.x,
                y: event.clientY - previousMousePosition.y
            };

            rotationSpeed = 0.005 * (window.devicePixelRatio || 1);
            let rotation = deltaMove.x * rotationSpeed;

            rotation = Math.max(Math.min(rotation, maxRotationSpeed), -maxRotationSpeed);

            selectedModel.rotation.y += rotation;

            selectedModel.rotation.y = selectedModel.rotation.y % (2 * Math.PI);
            if (selectedModel.rotation.y < 0) {
                selectedModel.rotation.y += 2 * Math.PI;
            }

            previousMousePosition.x = event.clientX;
            previousMousePosition.y = event.clientY;
        }

        const mouse = new THREE.Vector2(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1
        );

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(models, true);
        if (intersects.length > 0) {
            document.body.style.cursor = 'pointer';
        } else {
            document.body.style.cursor = 'auto';
        }
    });

    window.addEventListener('touchmove', (event) => {
        if (isPointInOverlay(event.touches[0].clientX, event.touches[0].clientY)) return;
        if (selectedModel && selectedModel.userData.isSelected) {
            event.preventDefault();
            if (event.touches.length === 1 && isDragging) {
                const currentX = event.touches[0].clientX;
                const deltaMove = currentX - touchStartX;

                const currentTime = Date.now();
                const timeDelta = Math.max(currentTime - lastTouchTime, 1);

                rotationSpeed = 0.005 * (window.devicePixelRatio || 1);
                let rotation = deltaMove * rotationSpeed;

                rotation = Math.max(Math.min(rotation, maxRotationSpeed), -maxRotationSpeed);

                selectedModel.rotation.y += rotation;

                selectedModel.rotation.y = selectedModel.rotation.y % (2 * Math.PI);
                if (selectedModel.rotation.y < 0) {
                    selectedModel.rotation.y += 2 * Math.PI;
                }

                rotationMomentum = rotation / timeDelta * 15;
                rotationMomentum = Math.max(Math.min(rotationMomentum, maxRotationSpeed), -maxRotationSpeed);

                touchStartX = currentX;
                lastTouchTime = currentTime;
            } else if (event.touches.length === 2) {
                const currentPinchDistance = Math.hypot(
                    event.touches[0].clientX - event.touches[1].clientX,
                    event.touches[0].clientY - event.touches[1].clientY
                );
                
                if (initialPinchDistance > 0) {
                    const pinchDelta = (currentPinchDistance - initialPinchDistance) * zoomSpeed;
                    handleZoom(pinchDelta);
                }
                
                initialPinchDistance = currentPinchDistance;
            }
        }
    }, { passive: false });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    window.addEventListener('touchend', () => {
        isDragging = false;
        initialPinchDistance = 0;
        if (Math.abs(rotationMomentum) > 0.0001) {
            requestAnimationFrame(updateModelRotation);
        }
    });

    window.addEventListener('wheel', (event) => {
        if (isPointInOverlay(event.clientX, event.clientY)) return;
        event.preventDefault();
        handleZoom(-event.deltaY * 0.0005);
    }, { passive: false });

    window.addEventListener('mousedown', onClick);
    window.addEventListener('touchstart', onClick, { passive: true });

    function resizeRenderer() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        renderer.setSize(width, height);
        camera.aspect = width / height;
        
        // Update initial camera position for mobile
        if (width <= 768) {
            initialCameraPosition.set(0, -2, 7 * mobileZoomFactor);
        } else {
            initialCameraPosition.set(0, -2, 7);
        }
        
        if (width <= 768) {
            cameraSlider.min = "-8";
            cameraSlider.max = "7";
        } else {
            cameraSlider.min = "-8";
            cameraSlider.max = "7";
        }
        
        camera.updateProjectionMatrix();
        adjustCameraAndModels();
        
        cameraSlider.value = "0";
        updateCameraPosition();
    }

    window.addEventListener('resize', resizeRenderer);

    // Add event listener for the "Add to Cart" button
    document.getElementById('add-to-cart').addEventListener('click', () => {
        const size = document.getElementById('size-select').value;
        const color = document.getElementById('color-select').value;
        const title = document.getElementById('product-title').textContent;
        alert(`Added ${title} (Size: ${size.toUpperCase()}, Color: ${color}) to cart!`);
    });

    // Overlay drag functionality
    function initOverlayDrag() {
        if (!isMobileDevice()) return;
    
        const overlay = document.getElementById('product-overlay');
        const dragHandle = document.querySelector('.drag-handle');
        const dragText = dragHandle.querySelector('.text');
        let startY, startHeight, isDragging = false;
    
        function updateDragHandleState(isUp) {
            if (isUp) {
                dragText.textContent = 'Swipe Down';
                dragHandle.classList.add('down');
            } else {
                dragText.textContent = 'Swipe Up';
                dragHandle.classList.remove('down');
            }
        }
    
        function startDragging(e) {
            if (!overlay.classList.contains('visible')) return;
            isDragging = true;
            startY = e.touches[0].clientY;
            startHeight = overlay.offsetHeight;
            overlay.style.transition = 'none';
        }
    
        function drag(e) {
            if (!isDragging) return;
            e.preventDefault();
            
            const currentY = e.touches[0].clientY;
            const deltaY = startY - currentY;
            let newHeight = startHeight + deltaY;
            newHeight = Math.max(window.innerHeight * 0.1, Math.min(newHeight, window.innerHeight * 0.9));
            
            overlay.style.height = `${newHeight}px`;
        }
    
        function stopDragging() {
            if (!isDragging) return;
            isDragging = false;
            overlay.style.transition = 'height 0.3s ease-out';
            
            const currentHeight = overlay.offsetHeight;
            const threshold = window.innerHeight * 0.5;
            
            if (currentHeight > threshold) {
                overlay.style.height = '90%';
                updateDragHandleState(true);
            } else {
                overlay.style.height = '10%';
                updateDragHandleState(false);
            }
        }
    
        dragHandle.addEventListener('touchstart', startDragging, { passive: false });
        window.addEventListener('touchmove', drag, { passive: false });
        window.addEventListener('touchend', stopDragging);
        window.addEventListener('touchcancel', stopDragging);
    
        // Initial state
        updateDragHandleState(false);
    }

    // Initialize overlay drag functionality
    initOverlayDrag();

    // Initial setup
    resizeRenderer();
    
    // Add this new code for the image lightbox
    const fullscreenViewer = document.getElementById('fullscreen-image-viewer');
    console.log('Fullscreen viewer element:', fullscreenViewer);
    const fullscreenImage = fullscreenViewer.querySelector('.fullscreen-image');
    const closeViewer = fullscreenViewer.querySelector('.close-viewer');
    const prevButton = fullscreenViewer.querySelector('.prev');
    const nextButton = fullscreenViewer.querySelector('.next');
    
    let currentImageIndex = 0;
    let images = [];

    function showImage(index) {
        fullscreenImage.src = images[index].src;
        currentImageIndex = index;
    }

    function showViewer() {
        console.log('Showing viewer');
        fullscreenViewer.style.display = 'flex';
    }

    function hideViewer() {
        fullscreenViewer.style.display = 'none';
    }

    closeViewer.addEventListener('click', hideViewer);

    prevButton.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        showImage(currentImageIndex);
    });

    nextButton.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        showImage(currentImageIndex);
    });
});