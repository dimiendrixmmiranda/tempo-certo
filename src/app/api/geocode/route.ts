import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    // Obtendo os parâmetros de consulta da URL
    const url = new URL(request.url);
    const query = url.searchParams.get('query'); // Acessando o parâmetro 'query'

    if (!query || typeof query !== 'string') {
        return NextResponse.json({ error: 'O parâmetro "query" é obrigatório e deve ser uma string' }, { status: 400 });
    }

    const apiKey = '7235d8842ec14f389692ac94567041f1';
    const urlOpenCage = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=${apiKey}&language=pt`;

    try {
        const response = await fetch(urlOpenCage);

        if (!response.ok) {
            return NextResponse.json({ error: 'Erro ao buscar a cidade' }, { status: 500 });
        }

        const data = await response.json();

        if (data.status.code !== 200 || data.results.length === 0) {
            return NextResponse.json({ error: 'Cidade não encontrada' }, { status: 404 });
        }

        const { lat, lng } = data.results[0].geometry;
        return NextResponse.json({ latitude: lat, longitude: lng });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Erro ao se comunicar com a API do OpenCage' }, { status: 500 });
    }
}
