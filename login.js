// Credenciales de login
const LOGIN_CREDENTIALS = {
    username: 'madisson',
    password: '1025528878'
};

// Elementos del DOM
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('error-message');
const loginBtn = document.querySelector('.login-btn');

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('isLoggedIn') === 'true') {
        redirectToHome();
    }
    
    loginForm.addEventListener('submit', handleLogin);
    
    addInputEffects();
    
    createDynamicHearts();
});

// Función para enviar notificación por email
async function sendLoginNotification(username) {
    try {
        const loginTime = new Date().toLocaleString('es-ES', {
            timeZone: 'America/Mexico_City',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        const formData = new FormData();
        formData.append('access_key', '73afd12b-ac6e-4283-be57-9527b2e18984');
        formData.append('name', 'Sistema de Login - Madisson Birthday');
        formData.append('email', 'login-notification@madisson-birthday.com');
        formData.append('subject', 'Ingreso cumpleaños madi');
        formData.append('message', `
¡Hola! 👋

Te informo que alguien acaba de acceder exitosamente a la página de cumpleaños de Madisson.

📋 Detalles del acceso:
• Usuario: ${username}
• Fecha y hora: ${loginTime}
• Página: Feliz Cumpleaños Madisson
• Estado: Acceso exitoso ✅

🎂 ¡Espero que esté disfrutando de la sorpresa!

---
Notificación automática del sistema de login
        `);
        
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            //body: formData
        });
        
        if (response.ok) {
            console.log('✅ Notificación de login enviada exitosamente');
        } else {
            console.log('⚠️ Error al enviar notificación de login');
        }
    } catch (error) {
        console.log('⚠️ Error al enviar notificación:', error);
    }
}

function handleLogin(event) {
    event.preventDefault();
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    
    showLoadingState();
    
    setTimeout(async () => {
        if (validateCredentials(username, password)) {
            // Login exitoso
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('loginTime', new Date().toISOString());
            
            // Enviar notificación por email
            await sendLoginNotification(username);
            
            showSuccessAnimation();
            
            setTimeout(() => {
                redirectToHome();
            }, 2000);
        } else {
            showError();
        }
        
        hideLoadingState();
    }, 1500);
}

function validateCredentials(username, password) {
    return username.toLowerCase() === LOGIN_CREDENTIALS.username.toLowerCase() && 
           password === LOGIN_CREDENTIALS.password;
}

function showLoadingState() {
    loginBtn.classList.add('loading');
    loginBtn.querySelector('span').textContent = 'Verificando...';
    hideError();
}

function hideLoadingState() {
    loginBtn.classList.remove('loading');
    loginBtn.querySelector('span').textContent = 'Entrar';
}

function showError() {
    errorMessage.style.display = 'block';
    errorMessage.classList.add('shake');
    
    // Limpiar campos
    usernameInput.value = '';
    passwordInput.value = '';
    usernameInput.focus();
    
    // Remover animación después de un tiempo
    setTimeout(() => {
        errorMessage.classList.remove('shake');
    }, 500);
}

// Ocultar error
function hideError() {
    errorMessage.style.display = 'none';
}

// Animación de éxito
function showSuccessAnimation() {
    loginBtn.classList.remove('loading');
    loginBtn.querySelector('span').textContent = '¡Bienvenida! 💖';
    loginBtn.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
    
    // Crear explosión de corazones
    createHeartExplosion();
}

// Redireccionar a la página principal
function redirectToHome() {
    window.location.href = './home.html';
}

// Efectos de los inputs
function addInputEffects() {
    const inputs = [usernameInput, passwordInput];
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
        
        // Efecto de escritura
        input.addEventListener('input', function() {
            if (this.value.length > 0) {
                this.style.borderColor = '#667eea';
            } else {
                this.style.borderColor = '#e1e1e1';
            }
        });
    });
}

// Crear corazones dinámicos adicionales
function createDynamicHearts() {
    const heartsContainer = document.querySelector('.hearts-container');
    
    setInterval(() => {
        if (document.querySelectorAll('.heart').length < 15) {
            const heart = document.createElement('div');
            heart.className = 'heart dynamic-heart';
            heart.style.left = Math.random() * 100 + '%';
            heart.style.animationDuration = (Math.random() * 2 + 3) + 's';
            heart.style.animationDelay = '0s';
            heart.style.fontSize = (Math.random() * 10 + 15) + 'px';
            
            heartsContainer.appendChild(heart);
            
            // Remover el corazón después de la animación
            setTimeout(() => {
                if (heart.parentNode) {
                    heart.parentNode.removeChild(heart);
                }
            }, 5000);
        }
    }, 2000);
}

// Explosión de corazones al hacer login exitoso
function createHeartExplosion() {
    const explosionContainer = document.createElement('div');
    explosionContainer.style.position = 'fixed';
    explosionContainer.style.top = '50%';
    explosionContainer.style.left = '50%';
    explosionContainer.style.transform = 'translate(-50%, -50%)';
    explosionContainer.style.pointerEvents = 'none';
    explosionContainer.style.zIndex = '1000';
    
    document.body.appendChild(explosionContainer);
    
    // Crear múltiples corazones para la explosión
    for (let i = 0; i < 20; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = '💖';
        heart.style.position = 'absolute';
        heart.style.fontSize = '24px';
        heart.style.color = '#ff69b4';
        
        const angle = (i / 20) * 360;
        const distance = 100 + Math.random() * 100;
        
        heart.style.animation = `explode 2s ease-out forwards`;
        heart.style.setProperty('--angle', angle + 'deg');
        heart.style.setProperty('--distance', distance + 'px');
        
        explosionContainer.appendChild(heart);
    }
    
    // Agregar keyframes para la explosión
    if (!document.querySelector('#explosion-styles')) {
        const style = document.createElement('style');
        style.id = 'explosion-styles';
        style.textContent = `
            @keyframes explode {
                0% {
                    transform: translate(0, 0) scale(1);
                    opacity: 1;
                }
                100% {
                    transform: translate(
                        calc(cos(var(--angle)) * var(--distance)),
                        calc(sin(var(--angle)) * var(--distance))
                    ) scale(0);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Limpiar después de la animación
    setTimeout(() => {
        if (explosionContainer.parentNode) {
            explosionContainer.parentNode.removeChild(explosionContainer);
        }
    }, 2000);
}

// Función para logout (útil para desarrollo)
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('loginTime');
    window.location.href = './index.html';
}

// Agregar funcionalidad de Enter en los campos
usernameInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        passwordInput.focus();
    }
});

passwordInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        loginForm.dispatchEvent(new Event('submit'));
    }
});

// Prevenir el envío del formulario si los campos están vacíos
loginForm.addEventListener('submit', function(e) {
    if (!usernameInput.value.trim() || !passwordInput.value.trim()) {
        e.preventDefault();
        showError();
        errorMessage.textContent = '❌ Por favor, completa todos los campos.';
        return false;
    }
});

// Efecto de parallax suave en los corazones al mover el mouse
document.addEventListener('mousemove', function(e) {
    const hearts = document.querySelectorAll('.heart');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    hearts.forEach((heart, index) => {
        const speed = (index % 3 + 1) * 0.5;
        const x = (mouseX - 0.5) * speed;
        const y = (mouseY - 0.5) * speed;
        
        heart.style.transform += ` translate(${x}px, ${y}px)`;
    });
});