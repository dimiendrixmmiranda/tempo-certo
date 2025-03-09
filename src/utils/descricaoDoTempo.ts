export function definirDescricaoDoTempo(code: number): { texto: string, imagem: string } {
    const descriptions: { [key: number]: { texto: string, imagem: string } } = {
        0: {
            texto: "Céu limpo",
            imagem: '/clima/ceu-limpo.png'
        },
        1: {
            texto: "Predomínio de sol",
            imagem: '/clima/predominante-sol.png'
        },
        2: {
            texto: "Parcialmente nublado",
            imagem: '/clima/parcialmente-nublado.png'
        },
        3: {
            texto: "Nublado",
            imagem: '/clima/nublado.png'
        },
        45: {
            texto: "Névoa",
            imagem: '/clima/nevoa.png'
        },
        48: {
            texto: "Névoa com geada",
            imagem: '/clima/nevoa-com-geada.png'
        },
        51: {
            texto: "Chuvisco fraco",
            imagem: '/clima/chuvisco-fraco.png'
        },
        53: {
            texto: "Chuvisco moderado",
            imagem: '/clima/chuvisco-moderado.png'
        },
        55: {
            texto: "Chuvisco intenso",
            imagem: '/clima/chuvisco-intenso.png'
        },
        61: {
            texto: "Chuva fraca",
            imagem: '/clima/chuvisco-fraco.png'
        },
        63: {
            texto: "Chuva moderada",
            imagem: '/clima/chuvisco-moderado.png'
        },
        65: {
            texto: "Chuva forte",
            imagem: '/clima/chuvisco-forte.png'
        },
        80: {
            texto: "Pancadas de chuva fraca",
            imagem: '/clima/chuvisco-fraco.png'
        },
        81: {
            texto: "Pancadas de chuva moderada",
            imagem: '/clima/chuvisco-moderado.png'
        },
        82: {
            texto: "Pancadas de chuva forte",
            imagem: '/clima/chuvisco-forte.png'
        },
        95: {
            texto: "Tempestade",
            imagem: '/clima/tempestade.png'
        },
        96: {
            texto: "Tempestade com granizo fraco",
            imagem: '/clima/tempestade-com-granizo.png'
        },
        99: {
            texto: "Tempestade com granizo forte",
            imagem: '/clima/tempestade-com-granizo.png'
        },
    };
    return descriptions[code] || "Desconhecido";
}