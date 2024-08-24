Chatbot para la Creación de Tickets a través de WhatsApp
Descripción del Proyecto
Este proyecto consiste en la implementación de un chatbot para WhatsApp, diseñado para facilitar la creación y gestión de tickets dentro del sistema de soporte de Grupo Caabsa. El chatbot permite a los usuarios reportar incidencias o realizar solicitudes de soporte directamente desde la aplicación de mensajería más utilizada y familiar para los empleados y clientes de la organización.

Funcionalidades Principales
Creación de Tickets: Los usuarios pueden generar tickets de soporte enviando mensajes a través de WhatsApp. El chatbot guía al usuario en el proceso, recopilando toda la información necesaria para crear un ticket en el sistema de soporte.
Actualizaciones en Tiempo Real: Una vez creado el ticket, el usuario recibe actualizaciones automáticas sobre el estado de su solicitud, asegurando un seguimiento adecuado y manteniendo informado al usuario.
Interacción Intuitiva: El chatbot está diseñado para ser fácil de usar, con flujos de conversación naturales y preguntas claras que simplifican el proceso de creación de tickets.
Integración con osTicket: El chatbot está completamente integrado con el sistema de gestión de tickets de Grupo Caabsa (osTicket), permitiendo que todas las solicitudes generadas a través de WhatsApp se registren automáticamente en el sistema central.
Requisitos del Proyecto
Node.js: El chatbot ha sido desarrollado utilizando Node.js.
Librería bot-whatsapp: Para la implementación del chatbot se utiliza la librería @bot-whatsapp/bot.
Sistema de Tickets osTicket: El chatbot está configurado para comunicarse directamente con la API de osTicket para la creación y actualización de tickets.
WhatsApp Business API: Es necesario tener configurado el acceso a la API de WhatsApp Business para la integración.
Instalación
Clonar el Repositorio:

bash
Copiar código
git clone https://github.com/deiccaabsa/helpdesk.git
Instalar Dependencias: Navega al directorio del proyecto e instala las dependencias necesarias:


Contribución
Las contribuciones son bienvenidas. Por favor, sigue el flujo de trabajo de Git estándar para realizar cambios:

Fork el repositorio
Crea una nueva rama (git checkout -b feature/nueva-funcionalidad)
Haz commit de tus cambios (git commit -m 'Agrega nueva funcionalidad')
Sube tu rama (git push origin feature/nueva-funcionalidad)
Abre un Pull Request
Licencia
Este proyecto está bajo la licencia MIT. Consulta el archivo LICENSE para obtener más detalles.

Contacto
Para cualquier consulta o problema, por favor contacta con el equipo de TI de Grupo Caabsa.