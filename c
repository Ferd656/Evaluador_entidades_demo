Vamos a analizar la viabilidad para las siguientes empresas o instrumentos financieros. A las empresas o instrumentos llamaremos 'sujeto'.

        Para cada una de los siguientes sujetos, coméntame los componentes que puedas, y consideres importantes. Por ejemplo, pero no limitado a:
        (noticias, reputación, estabilidad del país, polémicas recientes, etc...).
        A cada componente asigna un score del 0 al 100, donde 0 es muy malo y 100 es perfecto. Y junto a la nota asigna un porcentaje ponderador, para asignar más peso a aquellos componentes que consideras más importantes en aras de obtener una nota final para cada sujeto.

        Sitúate en el último trimestre 2024.

        Devuelve el análisis completo en formato JSON con la siguiente estructura:
        {
            nombre del sujeto: {
                componentes: [
                    componente_1: {nombre: "", comentario: "", nota: #, ponderador: #},
                    ...,
                    componente_n
                ]
            },
            ...,
            sujeto_n
        }

        Interpreta 'BCR' como 'Banco de Costa Rica'. Si no conoces algún sujeto o no puedes opinar sobre él, escribe 'NA' en lugar de los componentes.

        Sujetos: