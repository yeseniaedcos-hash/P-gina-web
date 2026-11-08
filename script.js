// DIRECCIÓN DE LA API
const API_URL = "https://hacker-news.firebaseio.com/v0";

// ELEMENTOS HTML
const newsList = document.getElementById("news-list");
const statusText = document.getElementById("status");
const refreshButton = document.getElementById("refresh-button");

// FUNCIÓN PARA CARGAR NOTICIAS
async function cargarNoticias() {

    refreshButton.disabled = true;
    refreshButton.textContent = "Cargando...";

    statusText.textContent = "Buscando noticias...";

    newsList.innerHTML = "";

    try {

        // Obtener identificadores de noticias
        const respuesta = await fetch(
            API_URL + "/topstories.json"
        );

        if (!respuesta.ok) {
            throw new Error("Error al conectar con la API");
        }

        const ids = await respuesta.json();

        if (!ids || ids.length === 0) {
            newsList.innerHTML =
                '<p class="mensaje">No hay noticias disponibles.</p>';
            return;
        }

        // Obtener las primeras 15 noticias
        const primerosIds = ids.slice(0, 15);

        const resultados = await Promise.allSettled(
            primerosIds.map(async (id) => {

                const response = await fetch(
                    API_URL + "/item/" + id + ".json"
                );

                if (!response.ok) {
                    throw new Error("Error al obtener noticia");
                }

                return await response.json();
            })
        );

        // Filtrar noticias válidas
        const noticias = resultados
            .filter(resultado => resultado.status === "fulfilled")
            .map(resultado => resultado.value)
            .filter(noticia =>
                noticia &&
                noticia.type === "story" &&
                noticia.title &&
                !noticia.deleted &&
                !noticia.dead
            );

        if (noticias.length === 0) {
            newsList.innerHTML =
                '<p class="mensaje">No se encontraron noticias.</p>';

            statusText.textContent = "Sin resultados";
            return;
        }

        // Mostrar noticias
        noticias.forEach(noticia => {

            const tarjeta = document.createElement("article");
            tarjeta.className = "news-card";

            const titulo = document.createElement("h3");
            const enlace = document.createElement("a");

            enlace.href = noticia.url ||
                ("https://news.ycombinator.com/item?id=" + noticia.id);

            enlace.textContent = noticia.title;
            enlace.target = "_blank";
            enlace.rel = "noopener noreferrer";

            titulo.appendChild(enlace);

            const autor = document.createElement("p");
            autor.textContent =
                "Autor: " + (noticia.by || "Desconocido");

            const puntos = document.createElement("p");
            puntos.textContent =
                "Puntuación: " + (noticia.score || 0);

            const comentarios = document.createElement("p");
            comentarios.textContent =
                "Comentarios: " + (noticia.descendants || 0);

            const leer = document.createElement("a");
            leer.href = enlace.href;
            leer.target = "_blank";
            leer.rel = "noopener noreferrer";
            leer.textContent = "Leer noticia completa";
            leer.className = "leer";

            tarjeta.appendChild(titulo);
            tarjeta.appendChild(autor);
            tarjeta.appendChild(puntos);
            tarjeta.appendChild(comentarios);
            tarjeta.appendChild(leer);

            newsList.appendChild(tarjeta);

        });

        statusText.textContent =
            "Se encontraron " + noticias.length + " noticias.";

    } catch (error) {

        console.error("Error:", error);

        newsList.innerHTML =
            '<p class="mensaje">No se pudieron cargar las noticias. Revisa tu conexión a Internet.</p>';

        statusText.textContent = "Error al consultar las noticias.";

    } finally {

        refreshButton.disabled = false;
        refreshButton.textContent = "Actualizar noticias";

    }
}

// BOTÓN PARA ACTUALIZAR
refreshButton.addEventListener("click", cargarNoticias);

// CARGAR NOTICIAS AUTOMÁTICAMENTE
cargarNoticias();