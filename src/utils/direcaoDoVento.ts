export default function definirDirecaoDoTempo(degrees: number): string {
    if (degrees >= 337.5 || degrees < 22.5) return "Norte (N)";
    if (degrees >= 22.5 && degrees < 67.5) return "Nordeste (NE)";
    if (degrees >= 67.5 && degrees < 112.5) return "Leste (L)";
    if (degrees >= 112.5 && degrees < 157.5) return "Sudeste (SE)";
    if (degrees >= 157.5 && degrees < 202.5) return "Sul (S)";
    if (degrees >= 202.5 && degrees < 247.5) return "Sudoeste (SO)";
    if (degrees >= 247.5 && degrees < 292.5) return "Oeste (O)";
    if (degrees >= 292.5 && degrees < 337.5) return "Noroeste (NO)";
    return "Desconhecido";
}