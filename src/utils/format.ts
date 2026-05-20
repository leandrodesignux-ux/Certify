export function formatRut(rut: string): string {
  const cleanRut = rut.replace(/\./g, '').replace('-', '');
  
  if (cleanRut.length < 2) return rut;
  
  const cuerpo = cleanRut.slice(0, -1);
  const dv = cleanRut.slice(-1).toUpperCase();
  
  let cuerpoFormateado = '';
  let contador = 0;
  
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    cuerpoFormateado = cuerpo[i] + cuerpoFormateado;
    contador++;
    if (contador === 3 && i !== 0) {
      cuerpoFormateado = '.' + cuerpoFormateado;
      contador = 0;
    }
  }
  
  return `${cuerpoFormateado}-${dv}`;
}

export function formatPercent(n: number): string {
  return `${Math.round(n)}%`;
}
