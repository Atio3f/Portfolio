//PIXI JS Fond étoilé 
(async () =>
    {
        // Create a new application
        const app = new PIXI.Application({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundAlpha: 50,  // Rendre le fond transparent
        });
    
        // Initialize the application
        await app.init({ resizeTo: window});
        // Append the application canvas to the document body
        document.body.appendChild(app.canvas);
    
        // Load the star texture
        const starTexture = await PIXI.Assets.load('https://pixijs.com/assets/star.png');
    
        const starAmount = 1000;
        let cameraZ = 0;
        const fov = 20;
        const baseSpeed = 0.025;    //Petite valeur comme 0.025 pour faire bouger les étoiles
        let speed = 0;
        let warpSpeed = 0;
        const starStretch = 1;  //Allonge les étoiles
        const starBaseSize = 0.05;
    
        // Create the stars
        const stars = [];
    
        for (let i = 0; i < starAmount; i++)
        {
            const star = {
                sprite: new PIXI.Sprite(starTexture),
                z: 0,
                x: 0,
                y: 0,
            };
    
            star.sprite.anchor.x = 0.5;
            star.sprite.anchor.y = 0.7;
            randomizeStar(star, true);
            app.stage.addChild(star.sprite);
            stars.push(star);
        }
    
        function randomizeStar(star, initial)
        {
            star.z = initial ? Math.random() * 2000 : cameraZ + Math.random() * 1000 + 2000;
    
            // Calculate star positions with radial random coordinate so no star hits the camera.
            const deg = Math.random() * Math.PI * 2;
            const distance = Math.random() * 50 + 1;
    
            star.x = Math.cos(deg) * distance;
            star.y = Math.sin(deg) * distance;
        }
    
        // Change flight speed every 5 seconds 
        /*setInterval(() =>
        {
            warpSpeed = warpSpeed > 0 ? 0 : 1;
        }, 5000);*/
        
        
        // Listen for animate update
        app.ticker.add((time) =>
        {
            // Simple easing. This should be changed to proper easing function when used for real. Sert à rien sans changement de vitesse
            //speed += (warpSpeed - speed) / 20;
            cameraZ += time.deltaTime * 10 * (speed + baseSpeed);
            for (let i = 0; i < starAmount; i++)
            {
                const star = stars[i];
    
                if (star.z < cameraZ) randomizeStar(star);
    
                // Map star 3d position to 2d with really simple projection
                const z = star.z - cameraZ;
    
                star.sprite.x = star.x * (fov / z) * app.renderer.screen.width + app.renderer.screen.width / 2;
                star.sprite.y = star.y * (fov / z) * app.renderer.screen.width + app.renderer.screen.height / 2;
    
                // Calculate star scale & rotation.
                const dxCenter = star.sprite.x - app.renderer.screen.width / 2;
                const dyCenter = star.sprite.y - app.renderer.screen.height / 2;
                const distanceCenter = Math.sqrt(dxCenter * dxCenter + dyCenter * dyCenter);
                const distanceScale = Math.max(0, (2000 - z) / 2000);
    
                star.sprite.scale.x = distanceScale * starBaseSize;
                // Star is looking towards center so that y axis is towards center.
                // Scale the star depending on how fast we are moving, what the stretchfactor is
                // and depending on how far away it is from the center.
                star.sprite.scale.y
                    = distanceScale * starBaseSize
                    + (distanceScale * speed * starStretch * distanceCenter) / app.renderer.screen.width;
                star.sprite.rotation = Math.atan2(dyCenter, dxCenter) + Math.PI / 2;
            }
        });
        window.addEventListener('resize', () => {
            app.renderer.resize(window.innerWidth, window.innerHeight);
        });

    })();



//Permet de cacher tous les éléments qui ne doivent pas être affichés au chargement de la page
window.addEventListener('DOMContentLoaded', () => {
    //On prend les containers cachés avec hidden
    const containers = document.querySelectorAll('.hidden');
    
    containers.forEach(container => {
    container.classList.remove('hidden');
    });
});