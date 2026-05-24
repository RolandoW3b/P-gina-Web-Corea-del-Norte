window.onload = () => {

    //auto-scroll al inicio al recargar pagina
    window.scrollTo(0, 0);

    // menú de hamburguesa 

    const btn = document.getElementById('hamburguesa');
    const menu = document.querySelector('.menu');
    const overlay = document.getElementById('overlay');
    const navbar = document.querySelector('.navbar');

    btn.addEventListener('click', () => {
        btn.classList.toggle('activo');
        menu.classList.toggle('menu-abierto');
        overlay.classList.toggle('activo');
    });

    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            btn.classList.remove('activo');
            menu.classList.remove('menu-abierto');
            overlay.classList.remove('activo');
        });
    });

    overlay.addEventListener('click', () => {
        btn.classList.remove('activo');
        menu.classList.remove('menu-abierto');
        overlay.classList.remove('activo');
    });

    // ocultar navbar al scrollear

    let scrollAnterior = 0;
    const UMBRAL = 3;

    window.addEventListener('scroll', () => {
        const scrollActual = window.scrollY;
        const diferencia = scrollActual - scrollAnterior;

        if (diferencia > UMBRAL) {
            navbar.classList.add('navbar-oculta');
            btn.classList.remove('activo');
            menu.classList.remove('menu-abierto');
            overlay.classList.remove('activo');
        } else if (diferencia < -UMBRAL) {
            navbar.classList.remove('navbar-oculta');
        }

        scrollAnterior = scrollActual;
    });
    // -------------------------------------------


 // carrusel
if (document.getElementById('carruselTrack')) {

    const crSrcs = [
        'images/carrusel1.jpg',
        'images/carrusel2.jpg',
        'images/carrusel3.jpg',
        'images/carrusel4.jpg',
        'images/carrusel5.jpg',
        'images/carrusel6.jpg',
        'images/carrusel7.jpg',
        'images/carrusel8.jpg',
        'images/carrusel9.jpg',
        'images/carrusel1.jpg',
        'images/carrusel2.jpg',
        'images/carrusel3.jpg',
        'images/carrusel4.jpg',
        'images/carrusel5.jpg',
        'images/carrusel6.jpg',
        'images/carrusel7.jpg',
        'images/carrusel8.jpg',
        'images/carrusel9.jpg',
        

    ];

    let crActual = 0;
    let crBloqueado = false;

    const crTrack    = document.getElementById('carruselTrack');
    const crVentana  = crTrack.parentElement;
    const crModal    = document.getElementById('carruselModal');
    const crModalImg = document.getElementById('carruselModalImg');

    function crMedidas() {
        const slide = crTrack.querySelector('.cr-slide');
        const estilo = getComputedStyle(slide);
        const w = slide.offsetWidth;
        const m = parseInt(estilo.marginLeft) + parseInt(estilo.marginRight);
        return { w, paso: w + m };
    }

    const crLista = [crSrcs[crSrcs.length - 1], ...crSrcs, crSrcs[0]];

    crLista.forEach((src, i) => {
        const slide = document.createElement('div');
        slide.className = 'cr-slide' + (i === 1 ? ' activa' : '');
        slide.innerHTML = `<img src="${src}" alt="">`;
        slide.addEventListener('click', () => {
            if (slide.classList.contains('activa')) {
                crModalImg.src = src;
                crModal.classList.add('abierto');
            }
        });
        crTrack.appendChild(slide);
    });

    function crGetSlides() { return crTrack.querySelectorAll('.cr-slide'); }

    function crActualizarClases() {
        crGetSlides().forEach((s, i) => s.classList.toggle('activa', i === crActual + 1));
    }

    function crOffset(indice) {
        const { w, paso } = crMedidas();
        const slide = crTrack.querySelector('.cr-slide');
        const marginLeft = parseInt(getComputedStyle(slide).marginLeft);
        const centroVentana = crVentana.offsetWidth / 2;
        const centroSlide   = w / 2;
        return paso * indice + marginLeft + centroSlide - centroVentana;
    }

    function crSaltarSinAnimacion(indice, callback) {
        crActual = indice;
        crTrack.style.transition = 'none';
        crTrack.style.transform  = `translateX(-${crOffset(crActual + 1)}px)`;
        crActualizarClases();
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                if (callback) callback();
            });
        });
    }

    crSaltarSinAnimacion(0);

    function crIrA(dir) {
        if (crBloqueado) return;
        crBloqueado = true;
        crActual += dir;

        crGetSlides().forEach(s => s.classList.add('moviendo'));
        crTrack.style.transition = 'transform 1.5s cubic-bezier(0.25, 0.1, 0.1, 1.0)';
        crTrack.style.transform  = `translateX(-${crOffset(crActual + 1)}px)`;
        crActualizarClases();

        crTrack.addEventListener('transitionend', function handler() {
            crTrack.removeEventListener('transitionend', handler);
            crGetSlides().forEach(s => s.classList.remove('moviendo'));

            if (crActual >= crSrcs.length) {
                crSaltarSinAnimacion(0, () => { crBloqueado = false; });
            } else if (crActual < 0) {
                crSaltarSinAnimacion(crSrcs.length - 1, () => { crBloqueado = false; });
            } else {
                crBloqueado = false;
            }
        });
    }

    document.getElementById('carruselPrev').addEventListener('click', () => { crIrA(-1); crReiniciarAutoplay(); });
    document.getElementById('carruselNext').addEventListener('click', () => { crIrA(1);  crReiniciarAutoplay(); });
    document.getElementById('carruselModalClose').addEventListener('click', () => crModal.classList.remove('abierto'));
    crModal.addEventListener('click', e => { if (e.target === crModal) crModal.classList.remove('abierto'); });

    window.addEventListener('resize', () => { crSaltarSinAnimacion(crActual); });

    const CR_INTERVALO = 5000;
    let crAutoplay = setInterval(() => crIrA(1), CR_INTERVALO);

    function crReiniciarAutoplay() {
        clearInterval(crAutoplay);
        crAutoplay = setInterval(() => crIrA(1), CR_INTERVALO);
    }

} 

// Saludo hora
if (document.getElementById('saludohora')) {
    const hora = new Date().getHours();
    const saludo = document.getElementById('saludohora');
    if (hora >= 5 && hora < 9) {
        saludo.textContent = '🌞 ¡Imagina despertar con estas vistas! 🌞';
    } else if (hora >= 9 && hora < 15) {
        saludo.textContent = '🔆 ¡Disfruta de tus tardes en Pyongyang! 🔆';
    } else if (hora >= 15 && hora < 19) {
        saludo.textContent = '🌅 ¡No hay nada como un atardecer en Corea! 🌅';
    } else {
        saludo.textContent = '⛺ ¡Agenda tus vacaciones antes de irte a dormir! ⛺';
    }
}

// Lightbox cartas
if (document.getElementById('cartaModal')) {
    const cartaModal        = document.getElementById('cartaModal');
    const cartaModalImg     = document.getElementById('cartaModalImg');
    const cartaModalTitulo  = document.getElementById('cartaModalTitulo');
    const cartaModalParrafo = document.getElementById('cartaModalParrafo');

    document.querySelectorAll('.carta').forEach(carta => {
        carta.style.cursor = 'pointer';
        carta.addEventListener('click', () => {
            cartaModalImg.src             = carta.querySelector('img').src;
            cartaModalImg.alt             = carta.querySelector('img').alt;
            cartaModalTitulo.textContent  = carta.querySelector('h2').textContent;
            cartaModalParrafo.textContent = carta.querySelector('p').textContent;
            cartaModal.classList.add('abierto');
        });
    });

    document.getElementById('cartaModalClose').addEventListener('click', () =>
        cartaModal.classList.remove('abierto')
    );
    cartaModal.addEventListener('click', e => {
        if (e.target === cartaModal) cartaModal.classList.remove('abierto');
    });
}

// Acordeón 
document.querySelectorAll('.acordeon-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const contenido = btn.nextElementSibling;
        const estaAbierto = btn.classList.contains('activo');

        document.querySelectorAll('.acordeon-btn').forEach(b => {
            b.classList.remove('activo');
            const c = b.nextElementSibling;
            c.classList.add('cerrando');
            c.classList.remove('abierto');
            setTimeout(() => c.classList.remove('cerrando'), 150);
        });

        if (!estaAbierto) {
            btn.classList.add('activo');
            contenido.classList.add('abierto');
        }
    });
});

//  Dropdown Ver Paquetes 
const dpDropdown = document.getElementById('paquetesDropdown');
if (dpDropdown) {
    let hideTimer = null;

     window.addEventListener('scroll', () => {
        clearTimeout(hideTimer);
        dpDropdown.classList.remove('activo');
    }, { passive: true });

    function mostrarDropdown(btn) {
        const r = btn.getBoundingClientRect();
        dpDropdown.style.top  = r.bottom + 'px';
        dpDropdown.style.left = r.left + 'px';
        dpDropdown.style.width = r.width + 'px';
        dpDropdown.classList.add('activo');
    }

    function ocultarDropdown() {
        hideTimer = setTimeout(() => dpDropdown.classList.remove('activo'), 150);
    }

    function cancelarOcultar() { clearTimeout(hideTimer); }

    document.querySelectorAll('.ver-paquetes-btn').forEach(btn => {
        btn.addEventListener('mouseover', () => { cancelarOcultar(); mostrarDropdown(btn); });
        btn.addEventListener('mouseout', ocultarDropdown);
        btn.addEventListener('click', e => {
            e.preventDefault();
            dpDropdown.classList.remove('activo');
            document.getElementById('modalComparar').classList.add('abierto');
        });
    });

    dpDropdown.addEventListener('mouseover', cancelarOcultar);
    dpDropdown.addEventListener('mouseout', ocultarDropdown);

    document.getElementById('btnEstandar').addEventListener('click', () => {
        dpDropdown.classList.remove('activo');
        document.getElementById('modalEstandar').classList.add('abierto');
    });

    document.getElementById('btnPro').addEventListener('click', () => {
        dpDropdown.classList.remove('activo');
        document.getElementById('modalPro').classList.add('abierto');
    });

    ['cerrarEstandar','cerrarPro','cerrarComparar'].forEach(id => {
        document.getElementById(id).addEventListener('click', () => {
            document.querySelectorAll('.paquete-modal').forEach(m => m.classList.remove('abierto'));
        });
    });

    document.querySelectorAll('.paquete-modal').forEach(m => {
        m.addEventListener('click', e => { if (e.target === m) m.classList.remove('abierto'); });
    });

    document.getElementById('verEstandar').addEventListener('click', () => {
        document.getElementById('modalComparar').classList.remove('abierto');
        document.getElementById('modalEstandar').classList.add('abierto');
    });

    document.getElementById('verPro').addEventListener('click', () => {
        document.getElementById('modalComparar').classList.remove('abierto');
        document.getElementById('modalPro').classList.add('abierto');
    });
}




};