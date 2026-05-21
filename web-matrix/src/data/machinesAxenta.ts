/** Демо-данные в стиле Axenta (мониторинг техники Нерал-Матрикс). */

export type MachineUnit = {
  id: string
  name: string
  plate: string
  status: string
  address: string
  lat: number
  lng: number
  speedKmh: number
  ignitionOn: boolean
  online: boolean
  batteryPct: number
  signalPct: number
  lastUpdate: string
  driver?: string
}

export const MAP_BOUNDS = {
  minLat: 54.08,
  maxLat: 54.165,
  minLng: 55.92,
  maxLng: 56.06,
}

export const axentaMachines: MachineUnit[] = [
  {
    id: 'siloking',
    name: 'Силокинг',
    plate: 'кормление · маршрут 2',
    status: 'На маршруте · кормление',
    address: 'Башкортостан, Туймазинский район, коровник 5–7',
    lat: 54.124,
    lng: 55.982,
    speedKmh: 18,
    ignitionOn: true,
    online: true,
    batteryPct: 92,
    signalPct: 88,
    lastUpdate: '14:02',
    driver: 'Гумеров З.',
  },
  {
    id: 'gazel-435',
    name: 'Нерал-Матрикс Газель',
    plate: 'е435хх702',
    status: 'В движении',
    address: 'Башкортостан, Туймазинский район, ул. Полевая',
    lat: 54.131,
    lng: 55.991,
    speedKmh: 42,
    ignitionOn: true,
    online: true,
    batteryPct: 76,
    signalPct: 95,
    lastUpdate: '14:05',
  },
  {
    id: 'kamaz-833',
    name: 'Нерал-Матрикс Камаз',
    plate: 'е833нр702',
    status: 'Стоит · кормоцех',
    address: 'Башкортостан, Туймазинский район, кормоцех',
    lat: 54.118,
    lng: 55.968,
    speedKmh: 0,
    ignitionOn: false,
    online: true,
    batteryPct: 100,
    signalPct: 72,
    lastUpdate: '14:04',
  },
  {
    id: 'loader-fel2',
    name: 'Погрузчик FEL-2',
    plate: 'склад',
    status: 'Стоит · кормоцех',
    address: 'Кормоцех · бункера зерна',
    lat: 54.112,
    lng: 55.971,
    speedKmh: 0,
    ignitionOn: true,
    online: true,
    batteryPct: 64,
    signalPct: 81,
    lastUpdate: '14:01',
  },
  {
    id: 'mtz-82',
    name: 'Трактор МТЗ-82',
    plate: 'поле №4',
    status: 'В движении · поле №4',
    address: 'Туймазинский район, поле №4 (уборка)',
    lat: 54.142,
    lng: 56.012,
    speedKmh: 12,
    ignitionOn: true,
    online: true,
    batteryPct: 58,
    signalPct: 67,
    lastUpdate: '14:05',
  },
  {
    id: 'gaz-211',
    name: 'Нерал-Матрикс Газ',
    plate: 'в211ск702',
    status: 'На объекте · ветслужба',
    address: 'Ферма · ветеринарный блок',
    lat: 54.126,
    lng: 55.975,
    speedKmh: 0,
    ignitionOn: false,
    online: true,
    batteryPct: 88,
    signalPct: 90,
    lastUpdate: '13:58',
  },
  {
    id: 'deere-6930',
    name: 'John Deere 6930',
    plate: 'телематика',
    status: 'В движении · силос',
    address: 'Маршрут силос · коровник 12',
    lat: 54.135,
    lng: 55.998,
    speedKmh: 22,
    ignitionOn: true,
    online: false,
    batteryPct: 41,
    signalPct: 0,
    lastUpdate: '12:40',
  },
]

export function machineMapPosition(lat: number, lng: number): { left: string; top: string } {
  const { minLat, maxLat, minLng, maxLng } = MAP_BOUNDS
  const x = ((lng - minLng) / (maxLng - minLng)) * 100
  const y = ((maxLat - lat) / (maxLat - minLat)) * 100
  return { left: `${Math.min(96, Math.max(4, x))}%`, top: `${Math.min(92, Math.max(6, y))}%` }
}
