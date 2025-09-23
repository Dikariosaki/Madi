// Función para verificar si el usuario está autenticado
function checkAuthentication() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const loginTime = localStorage.getItem('loginTime');
    
    // Verificar si no está logueado
    if (isLoggedIn !== 'true') {
        redirectToLogin();
        return false;
    }
    
    // Verificar si la sesión ha expirado (opcional: 24 horas)
    if (loginTime) {
        const loginDate = new Date(loginTime);
        const now = new Date();
        const hoursDifference = (now - loginDate) / (1000 * 60 * 60);
        
        // Si han pasado más de 24 horas, cerrar sesión
        if (hoursDifference > 24) {
            logout();
            return false;
        }
    }
    
    return true;
}

// Función para redirigir al login
function redirectToLogin() {
    console.log('❌ Usuario no autenticado, redirigiendo al login...');
    window.location.href = './index.html';
}

// Función para cerrar sesión
function logout() {
    console.log('⏰ Sesión expirada, cerrando sesión...');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('loginTime');
    redirectToLogin();
}

// Verificar autenticación al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    
    // Event listener para el formulario de calendario
    const calendarForm = document.getElementById('calendarForm');
    if (calendarForm) {
        calendarForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = document.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            // Mostrar estado de carga
            submitBtn.textContent = '📤 Enviando...';
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
            
            const formData = {
                eventDate: document.getElementById('eventDate').value,
                eventTitle: document.getElementById('eventTitle').value,
                dayActivity: document.querySelector('input[name="dayActivity"]:checked')?.value || '',
                italianFood: document.querySelector('input[name="italianFood"]:checked')?.value || '',
                liveMusic: document.querySelector('input[name="liveMusic"]:checked')?.value || '',
                nightView: document.querySelector('input[name="nightView"]:checked')?.value || '',
                dancing: document.querySelector('input[name="dancing"]:checked')?.value || '',
                specialRequest: document.getElementById('specialRequest').value
            };
            
            try {
                const result = await sendCalendarData(formData);
                
                if (result.success) {
                    // Mostrar éxito
                    submitBtn.textContent = '✅ ¡Enviado!';
                    submitBtn.style.background = 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)';
                    
                    setTimeout(() => {
                        closeModal('modalCalendar');
                        calendarForm.reset();
                        
                        // Restaurar botón
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                        submitBtn.style.opacity = '1';
                        submitBtn.style.background = 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)';
                    }, 2000);
                } else {
                    // Mostrar error
                    submitBtn.textContent = '❌ Error - Reintentar';
                    submitBtn.style.background = 'linear-gradient(135deg, #e67e22 0%, #d35400 100%)';
                    
                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                        submitBtn.style.opacity = '1';
                        submitBtn.style.background = 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)';
                    }, 3000);
                }
            } catch (error) {
                // Mostrar error de conexión
                submitBtn.textContent = '❌ Sin conexión';
                submitBtn.style.background = 'linear-gradient(135deg, #e67e22 0%, #d35400 100%)';
                
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                    submitBtn.style.background = 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)';
                }, 3000);
            }
        });
    }
});

// Función para enviar datos del calendario por email usando W3Forms
async function sendCalendarData(formData) {
    try {
        const now = new Date();
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const formattedDate = now.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });

        const eventDate = new Date(formData.eventDate);
        const formattedEventDate = eventDate.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });

        const w3FormData = new FormData();
        w3FormData.append('access_key', '73afd12b-ac6e-4283-be57-9527b2e18984');
        w3FormData.append('name', 'Sistema de Calendario - Cartas del Corazón');
        w3FormData.append('email', 'calendario-notification@cartas-corazon.com');
        w3FormData.append('subject', `Nueva planificación: ${formData.eventTitle}`);
        w3FormData.append('message', `¡Hola! 

Tu pareja ha planificado algo especial contigo:

📅 DETALLES DEL EVENTO:
• Actividad: ${formData.eventTitle}
• Fecha y hora: ${formattedEventDate}

💭 SUS PREFERENCIAS:
• Te recojo en casa: ${formData.dayActivity}
• Vestirnos del mismo color: ${formData.italianFood}
• Vista nocturna: ${formData.nightView}
• Bailar: ${formData.dancing}

${formData.specialRequest ? `✨ PETICIÓN ESPECIAL:\n${formData.specialRequest}\n\n` : ''}📧 INFORMACIÓN DEL ENVÍO:
• Enviado el: ${formattedDate}
• Zona horaria: ${timeZone}

¡Espero que puedan disfrutar juntos de este momento especial! 💖

Con amor,
Tu sistema de planificación romántica 💕`);

        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: w3FormData
        });

        if (response.ok) {
            console.log('✅ Datos del calendario enviados exitosamente');
            return { success: true, message: '¡Planificación enviada exitosamente! 💕' };
        } else {
            console.log('⚠️ Error al enviar datos del calendario');
            return { success: false, message: 'Error al enviar la planificación. Inténtalo de nuevo.' };
        }
    } catch (error) {
        console.log('⚠️ Error al enviar datos del calendario:', error);
        return { success: false, message: 'Error de conexión. Verifica tu internet e inténtalo de nuevo.' };
    }
}

// Función para enviar notificación por email cuando se abre un modal
async function sendModalNotification(modalTitle) {
    try {
        // Obtener la hora local del sistema
        const now = new Date();
        const openTime = now.toLocaleString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        
        // También incluir la zona horaria detectada automáticamente
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        const formData = new FormData();
        formData.append('access_key', '73afd12b-ac6e-4283-be57-9527b2e18984');
        formData.append('name', 'Sistema de Modales - Cartas del Corazón');
        formData.append('email', 'modal-notification@cartas-corazon.com');
        formData.append('subject', 'Modal abierto: ' + modalTitle);
        formData.append('message', `
¡Hola! 💌

Te informo que se acaba de abrir una carta del corazón en la página.

📋 Detalles:
• Carta abierta: "${modalTitle}"
• Fecha y hora: ${openTime}
• Zona horaria: ${timeZone}
• Página: Cartas del Corazón
• Estado: Modal abierto ✅

💕 ¡Alguien está leyendo tus cartas de amor!

---
Notificación automática del sistema de modales
        `);
        
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            console.log('✅ Notificación de modal enviada exitosamente para:', modalTitle);
        } else {
            console.log('⚠️ Error al enviar notificación de modal');
        }
    } catch (error) {
        console.log('⚠️ Error al enviar notificación:', error);
    }
}

function openModal(modalId) {
    // Verificar autenticación antes de abrir el modal
    if (!checkAuthentication()) {
        return; // Si no está autenticado, no abrir el modal
    }
    
    const modal = document.getElementById(modalId);
    const modalTitle = modal.querySelector('.modal-title').textContent;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevenir scroll del body
    
    // Enviar notificación por email
    sendModalNotification(modalTitle);
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.body.style.overflow = 'auto'; // Restaurar scroll del body
}

// Cerrar modal al hacer click fuera del contenido
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// Cerrar modal con la tecla Escape
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (modal.style.display === 'block') {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
});

// Soporte para navegación por teclado
document.querySelectorAll('.card').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
        }
    });
});