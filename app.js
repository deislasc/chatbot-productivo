const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')
const MetaProvider = require('@bot-whatsapp/provider/meta')
const MockAdapter = require('@bot-whatsapp/database/mock')
const axios = require('axios');





/**
 * Aqui declaramos los flujos hijos, los flujos se declaran de atras para adelante, es decir que si tienes un flujo de este tipo:
 *
 *          Menu Principal
 *           - SubMenu 1
 *             - Submenu 1.1
 *           - Submenu 2
 *             - Submenu 2.1
 *
 * Primero declaras los submenus 1.1 y 2.1, luego el 1 y 2 y al final el principal.
 */

// Flujo de inactividad

const flowinactividad = addKeyword(['salir'])
    .addAnswer('Se canceló tu solicitud por inactividad. Por favor, vuelve a generar tu solicitud.', {
        capture: true,
        buttons: [
            { body: 'Menú Principal' }, // Asumiendo que deseas un solo botón que lleve al usuario al Menú Principal
        ],
    })
    .addAction(async (ctx, { gotoFlow }) => {
        // Asume que el texto del botón "Menú Principal" llega como un mensaje de texto normal
        if (ctx.body === 'Menú Principal') {
            // Usa gotoFlow para redirigir al usuario al flujo principal
            return gotoFlow(flowPrincipal); // Ajusta esto según el identificador correcto de tu flowPrincipal
        }
    });

// Agregar el flujo al bot
// bot.addFlows(flowinactividad);



// Flujo de encuesta de satisfacción

const flowEncuesta = addKeyword(['answer'])
    .addAnswer('Nos ayudas a mejorar con tu opinión. ¿Qué tan satisfecho estás con el servicio que te brindamos?', )
    .addAnswer('Da clic en el enlace para contestar la encuesta de satisfacción: https://docs.google.com/forms/d/e/1FAIpQLSfGgl0atBS9dDC2XdnFRBwRBKbkcWafi81vvkAEJZ8UTP2PuA/viewform?usp=sf_link ',)

    .addAnswer('Regresa al Menu Principal', {
        capture: true,
        buttons: [
            { body: 'Menú Principal' },
        ],
    })
    
   .addAction(async (ctx, { gotoFlow }) => {
        // Asume que el texto del botón "Menú Principal" llega como un mensaje de texto normal
        if (ctx.body === 'Menú Principal') {
            // Usa gotoFlow para redirigir al usuario al flujo principal
            return gotoFlow(flowPrincipal); // Ajusta esto según el identificador correcto de tu flowPrincipal
        
        }
    });


        
// Flujo para salir del chatbot //

// Definición del flujo para salir con un botón hacia el Menú Principal
// Definición del flujo con botones
const flowsalir = addKeyword(['exit'])
    .addAnswer('Muchas gracias por usar el sistema. Puedes consultar la página http://helpdesk.caabsa.com/ para más información. Si deseas realizar otra consulta, Selecciona el botón de abajo.', {
        capture: true,
        buttons: [
            { body: 'Menú Principal' }, // Asumiendo que deseas un solo botón que lleve al usuario al Menú Principal
        ],
    })

// Aquí suponemos que necesitas implementar un manejador para las respuestas de botones.
// Este manejador podría formar parte de .addAction si tu framework lo soporta de esa manera.
.addAction(async (ctx, { gotoFlow }) => {
    // Asume que el texto del botón "Menú Principal" llega como un mensaje de texto normal
    if (ctx.body === 'Menú Principal') {
        // Usa gotoFlow para redirigir al usuario al flujo principal
        return gotoFlow(flowPrincipal); // Ajusta esto según el identificador correcto de tu flowPrincipal
    }
    // Aquí puedes manejar otras opciones si tienes más botones o necesitas procesar otras entradas
});



// Este es el flujo de conversación para consultar el status de un ticket //

const flowstatus = addKeyword(['status'])    
.addAnswer(
    'Ingresa el número de ticket que deseas consultar:',
    {
        capture: true,
    },
    async (ctx, { flowDynamic, state }) => {
        await state.update({ number: ctx.body })
        console.log(`number: ${ctx.body}`);
    
        // Envia la petición GET a la siguiente URL https://helpdesk.caabsa.com/api/status.ticket.php?number=XXXXXX, donde el número de ticket es el que proporcionó el usuario

        const getURL = "http://helpdesk.caabsa.com/api/status.ticket.php";
        const getResponse = await axios.get(getURL, {
            params: {
                number: ctx.body
            }
        });
        console.log('Número de ticket obtenido:', getResponse.data);
        await flowDynamic(`El status de tu ticket es: ${getResponse.data}`);
        await flowDynamic('Recuerda que puedes darle seguimiento a tu ticket accediendo desde https://helpdesk.caabsa.com/')
    
}

)
                  

.addAnswer('¿Deseas contestar la encuesta de satisfacción para ayudarnos a mejorar nuestro servicio?', {
    capture: true,
    buttons: [
        {body: 'Sí, quiero contestar'},
        {body: 'No, gracias'},
    ]
})
.addAction(async (ctx, { gotoFlow }) => {
    if (ctx.body === 'Sí, quiero contestar') {
        return gotoFlow(flowEncuesta);
    }
    else{
        return gotoFlow(flowsalir)
    }
    // Aquí puedes manejar la respuesta de 'No, gracias' si es necesario
});


// Este es el flujo para crer un nuevo ticket //


const flowCrearTicket = addKeyword(['request'])
    .addAnswer('Te ayudaré a crear un nuevo ticket, necesitaré algunos datos para poder generar tu solicitud.', null, async (ctx, { gotoFlow }) => {
        // Asegúrate de retornar la llamada a gotoFlow
        return gotoFlow(flowemail); // Ajusta esto según el contexto de tu aplicación
    });


 
// Este es el flujo para capturar el email del usuario //

const flowemail = addKeyword(['e_mail'])
    .addAnswer(
        '¿Cuál es tu email corporativo?',
        {
            capture: true,
            idle: 300000, // Tiempo de inactividad en milisegundos (5 minutos)
        },
        async (ctx, { fallBack, state, gotoFlow }) => {
            const email = ctx.body;
            if (!email) {
                console.log('Correo electrónico no capturado, redirigiendo...');
                return gotoFlow(flowinactividad); // Redirige al flujo de inactividad
            }

            console.log(`email: ${email}`);

            // Lista de dominios de correo electrónico permitidos
            const allowedDomains = [
                'aamecsa.com', 'alcada.mx', 'alo-fund.com', 'alo-fund.com.mx', 
                'arrendadorathh.com', 'brioche.com.mx', 'businessinsider.mx', 
                'caabsa.com', 'caabsa.com.mx', 'caabsadesarrollos.com', 
                'caabsaeagle.com', 'caabsaeagle.com.mx', 'caabsainfraestructura.com.mx', 
                'caabsareco.com', 'caeinsurance.com', 'caemexico.com.mx', 
                'concret.com.mx', 'desarrolladorayucateca.com.mx', 'digitallpost.com.mx', 
                'digitallpost.mx', 'driveaplicacion.com', 'driveapp.mx', 'eco5.mx', 
                'elrio.com.mx', 'entra-e.com', 'entra.mx', 'entraestacionamientos.com.mx', 
                'expomexico.com.mx', 'exposantafe.com.mx', 'fundaciongrupocaabsa.com.mx', 
                'fundaciongrupocaabsa.mx','fastcompany.mx', 'gaabrisk.com', 'hostmx.com.mx', 'ialinfra.com', 
                'jaliscolimpio.mx', 'jardinsantafe.com.mx', 'jgsasesores.mx', 'l-m.com.mx', 'matatena.com',
                'mediasurf.mx', 'mipymex.mx', 'obcapital.org', 'powerkwh.com', 
                'powerkwh.com.mx', 'pret.com.mx', 'pretfabricados.mx', 'recojalisco.com', 'siel-seguridad.com', 
                'siel-seguridad.com.mx', 'tenus.mx', 'truckspret.mx'
            ];

            // Validación del dominio del correo electrónico
            const isValidDomain = allowedDomains.some(domain => email.endsWith(domain));

            if (isValidDomain) {
                await state.update({ email: email });

                return gotoFlow(flowSubject); // Asegúrate de que 'flowcompany' está correctamente definido y accesible
            } else {
                return fallBack();
            }
        }
    );


    // Flujo para capturar el titulo de la incidencia.

    const flowSubject = addKeyword(['subject'])
    .addAnswer(
        'Por favor, proporciona un título para la incidencia que deseas reportar:',
        {
            capture: true,
            idle: 300000, // 5 minutos de inactividad
        },
        async (ctx, { fallBack, state, gotoFlow }) => {
            const subject = ctx.body;
            console.log(`subject: ${subject}`);
            await state.update({ subject: subject });
            if (!subject) {
                console.log('Respuesta del usuario no capturada, redirigiendo...');
                // Aquí también redirigimos al flujo de inactividad si la respuesta no se captura
                return gotoFlow(flowinactividad);
            }
            return gotoFlow(flowmessage);
        }
    )
    .addAction(async (ctx, { gotoFlow, idleFallBack }) => {
        if (ctx.idleFallBack) {
            console.log('Usuario inactivo, redirigiendo...');
            return gotoFlow(flowinactividad);
        } else {
            console.log('Usuario activo, redirigiendo...');
            // Aquí puedes redirigir a otro flujo si se necesita
            // return gotoFlow(otroFlujo);
        }
    });

    // Flujo para captura los detalles de la incidencia

    const flowmessage = addKeyword(['message'])
    .addAnswer(
        'Por favor, proporciona una breve descripción de la incidencia que deseas reportar:',
        {
            capture: true,
            idle: 300000, // 5 minutos de inactividad
        },
        async (ctx, { fallBack, state, gotoFlow }) => {
            const message = ctx.body;
            console.log(`message: ${message}`);
            await state.update({ message: message });
            if (!message) {
                console.log('Respuesta del usuario no capturada, redirigiendo...');
                // Aquí también redirigimos al flujo de inactividad si la respuesta no se captura
                return gotoFlow(flowinactividad);
            }
            return gotoFlow(flowsend);
        }
    )
    .addAction(async (ctx, { gotoFlow, idleFallBack }) => {
        if (ctx.idleFallBack) {
            console.log('Usuario inactivo, redirigiendo...');
            return gotoFlow(flowinactividad);
        } else {
            console.log('Usuario activo, redirigiendo...');
            // Aquí puedes redirigir a otro flujo si se necesita
            // return gotoFlow(otroFlujo);
        }
    });


    // Flujo para enviar datos a la API de HelpDesk
    
    const flowsend = addKeyword(['send'])
    .addAnswer(
        'Procesando tu solicitud ...🕑',
        null,
        async (_, { flowDynamic, state, gotoFlow }) => { // Asegúrate de incluir gotoFlow en la destructuración si es necesario
            const myState = state.getMyState();
            console.log(myState);

            // URL del endpoint al que enviarás los datos
            const apiURL = "https://helpdesk.caabsa.com/api/tickets.json";
            const headers = {
                "X-API-Key": "82E6F50A59E863DE9D6A2E9CCBC76C33",
                "Content-Type": "application/json; charset=UTF-8"
            };

            try {
                const postResponse = await axios.post(apiURL, myState, { headers: headers });
                console.log('Datos enviados con éxito:');

                // Si los datos se enviaron con éxito, realiza una petición GET
                const getURL = "https://helpdesk.caabsa.com/api/get.ticket.php";
                const getResponse = await axios.get(getURL, {
                    params: {
                        subject: postResponse.data.ticket_id // Asume que ticket_id es el subject
                    }
                });
                console.log('Número de ticket obtenido:', postResponse.data);

                // Añadir respuesta para mostrar el número de ticket al usuario
                await flowDynamic(`Tu número de ticket es: *${postResponse.data}*`);
                await flowDynamic('En breve un agente se pondrá en contacto contigo. ¡Gracias!');
                await flowDynamic('Puedes darle seguimiento a tu ticket accediendo desde https://helpdesk.caabsa.com/');

                // Una vez completado todo lo anterior, redirige al flujo 'flownewrequest'
                return gotoFlow(flownewrequest); // Asegúrate de que 'flownewrequest' es el identificador correcto para el flujo de destino

            } catch (error) {
                console.error('Error al enviar o recibir los datos:', error);
                // Considera manejar el error adecuadamente, tal vez redirigiendo a un flujo de manejo de errores o informando al usuario
            }
        }
    );



    const flownewrequest = addKeyword(['newrequest'])
    .addAnswer('¿Deseas realizar otra acción?', 
    {
        capture: true,
        buttons: [
            {body: 'Nuevo Ticket'},
            {body: 'Menú Principal'},
        ]
    },
)

.addAction(async (ctx, { gotoFlow }) => {
    if (ctx.body === 'Nuevo Ticket') {
        return gotoFlow(flowCrearTicket);
    } else if (ctx.body === 'Menú Principal') {
        return gotoFlow(flowPrincipal);
    }
});

   

const flowPrincipal = addKeyword(['hola', 'buenos dias', 'buenos días', 'buenas tardes', 'buenas noches', 'ola'])
    .addAnswer('¡Saludos! Soy el asistente virtual de Grupo Caabsa. ¿En qué puedo ayudarte hoy?', {
        capture: true,
        buttons: [
            { body: '🏷️ Crear Ticket' },
            { body: '🔎 Consultar Status'},
            { body: '🛑 Salir' },
        ],
        idle: 10000, // Espera 10 segundos de inactividad
    })
    .addAction(async (ctx, { gotoFlow }) => {
        if (ctx?.idleFallBack) {
            // Aquí defines lo que sucede si se cumple la condición de inactividad
            // Por ejemplo, redirigir al usuario al flujo de salida. Asegúrate de que 'flowsalir' esté correctamente definido.
            return gotoFlow(flowsalir); 
        }

        // Aquí manejas las respuestas activas del usuario
        switch (ctx.body) {
            case '🏷️ Crear Ticket':
                return gotoFlow(flowCrearTicket);
            case '🔎 Consultar Status':
                return gotoFlow(flowstatus);
            case '🛑 Salir':
                return gotoFlow(flowsalir);
        }
    });


        


const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal, flowsalir, flowstatus, flowCrearTicket, flowemail, flowSubject, flowmessage, flowsend, flownewrequest, flowEncuesta, flowinactividad])

    const adapterProvider = createProvider(MetaProvider, {
        jwtToken: 'EAAjU79SG5ucBO3oZA37dFIZCFmsFEUXMox9J9G2JmRg2INXqPM4G61YgJhDo9KHtAqTAS4lbs2fz5hbN2wlqYfwJW6LJ2eFl4hx8f21TitcA161fHZBubXhGSkKMAy1vjtI7U6FuG1cf2oy1y8CfjnrheMh2F7pFSKpwhTbguZAhZA74MoZBmtvWcKnsYO6LIQEAZDZD',
        numberId: '177049528824758',
        verifyToken: 'tokendev',
        version: 'v16.0',
    })

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })
}

main()
