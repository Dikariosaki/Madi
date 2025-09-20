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