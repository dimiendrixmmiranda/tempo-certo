export function obterDiaDaSemana(dataISO: string): string {
    const diasDaSemana = [
        'domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'
    ]

    const data = new Date(dataISO)

    const horaLocal = data.getHours()
    data.setHours(horaLocal + data.getTimezoneOffset() / 60)

    const dia = diasDaSemana[data.getDay()]
    return dia
}