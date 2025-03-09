const nodemailer = require("nodemailer");

module.exports = async (req, res) => {
  // Solo se permiten solicitudes POST
  console.log("📥 Se recibió una solicitud:", req.method);
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  console.log("✅ Método permitido. Recibiendo datos...");
  console.log("📩 Datos en req.body:", req.body);

  try {
    const { name, email, attending, phone } = req.body;
    if (!name || !email || !phone || !attending) {
      throw new Error("Faltan datos requeridos en la solicitud");
    }

    console.log("✅ Datos validados:", { name, email, attending, phone });

    // Configurar el transportador para enviar el correo
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,    // Configurado en Vercel (ej: personalsolares@gmail.com)
        pass: process.env.EMAIL_PASS     // Contraseña de aplicación de Gmail
      }
    });
    console.log("📧 Transportador de correo configurado correctamente");

    // Construir el contenido del correo (mismo texto que usaremos para WhatsApp)
    const messageContent = `
      Confirmación de Asistencia:
      Nombre: ${name}
      Teléfono: ${phone}
      Email: ${email}
      Asistencia: ${attending}
    `;

    const htmlContent = `
      <div style="font-family: 'Josefin Slab', serif; text-align: center; background-color: #f8f9fa; padding: 20px;">
          <div style="background-color: #ffffff; padding: 20px; border-radius: 10px; max-width: 600px; margin: auto; border: 1px solid #dddddd;">
              <div style="background-image: url('https://your-image-url.com/background.jpg'); background-size: cover; padding: 30px; border-radius: 10px;">
                  <h1 style="color: #ff6f61; font-family: 'Lancelot', cursive; font-size: 2.5em;">Alejandra y Roberto</h1>
                  <p style="color: #555555; font-size: 1.2em;">Hola <strong>${name}</strong></p>
                  <p style="color: #555555;">Nos complace invitarte a la boda de <strong>Alejandra y Roberto</strong>.</p>
                  <p style="color: #555555;"><strong>Fecha:</strong> 24 de Mayo de 2025</p>
                  <p style="color: #555555;"><strong>Ceremonia religiosa:</strong> Parroquia del Sagrado Corazón de Jesús, Calle Gil Preciado NO.11, Zona Centro, Tecolotlán Jal.</p>
                  <p style="color: #555555;"><strong>Evento social:</strong> Terraza las Palmas, Calle Roble NO.28, CP.48540 Tecolotlán, Jal.</p>
                  <p style="color: #555555; font-size: 1.1em;">¡Nos gustaria contar con tu valiosa presencia!</p>
              </div>
              <img src="https://your-image-url.com/footer-image.jpg" alt="Decorative Image" style="max-width: 100%; border-radius: 10px;">
          </div>
      </div>
    `;

    // Enviar el correo al destinatario (puedes modificar "to" según necesites)
    await transporter.sendMail({
      from: '"Boda de Alejandra y Roberto" <tu_correo@gmail.com>',
      to: email, // Se envía al correo ingresado, o puedes enviarlo a otro destinatario
      subject: "Confirmación de Asistencia - Boda de Alejandra y Roberto",
      html: htmlContent
    });
    console.log("✅ Correo enviado exitosamente");

    // Generar el enlace de WhatsApp
    // Suponemos que tienes una variable de entorno ADMIN_WHATSAPP_NUMBER con el número al que se enviará el mensaje
    // El número debe estar en formato internacional, por ejemplo: +521234567890.
    // Para el enlace, eliminamos el signo '+'.
    const adminNumber = process.env.ADMIN_WHATSAPP_NUMBER.replace(/^\+/, "");
    const whatsappLink = "https://wa.me/" + adminNumber + "?text=" + encodeURIComponent(messageContent);

    const swiper = new Swiper(".swiper", {
        slidesPerView: 5,
        spaceBetween: 0,
        centeredSlides: true,
        loop: true,
        simulateTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      })
      
      const calculateHeight = () => {
        const swiperSlideElements = Array.from(document.querySelectorAll('.swiper .swiper-slide'))
        if (!swiperSlideElements.length) return
        const width = swiperSlideElements[0].getBoundingClientRect().width
        const height = Math.round(width / (16 / 9))
        swiperSlideElements.map(element => element.style.height = `${height}px`)
      }      
      
      document.addEventListener("DOMContentLoaded", calculateHeight)
      addEventListener('resize', calculateHeight)

    // Devolver la respuesta con el enlace de WhatsApp
    return res.status(200).json({
      message: "Correo enviado y enlace de WhatsApp generado correctamente.",
      whatsappLink: whatsappLink
    });
  } catch (error) {
    console.error("Error en el backend:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
};
