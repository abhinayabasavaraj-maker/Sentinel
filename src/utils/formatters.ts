export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${meters}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}

export function formatSecondsToHMS(totalSeconds: number): string {
  const isNegative = totalSeconds < 0;
  const abs = Math.abs(Math.floor(totalSeconds));
  const hrs = Math.floor(abs / 3600);
  const mins = Math.floor((abs % 3600) / 60);
  const secs = abs % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');
  const formatted = `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  return isNegative ? `-${formatted}` : formatted;
}
