export default function extrairHora(dataISO: string): string {
    return dataISO.split('T')[1]
}